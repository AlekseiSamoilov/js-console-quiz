class CodeExecutorService {
    private worker: Worker | null = null;
    private isWorkerReady: boolean = false;
    private pendingPromises = new Map<string, {
        resolve: (value: string) => void;
        reject: (reason: any) => void;
    }>();
    private initializationPromise: Promise<void> | null = null;
    private workerSupported: boolean = true;

    constructor() {
        this.checkWorkerSupport();
        if (this.workerSupported) {
            this.initWorker();
        }
    }

    private checkWorkerSupport(): void {
        this.workerSupported = typeof window !== 'undefined' &&
            typeof Worker !== 'undefined' &&
            window.location.protocol !== 'file:';
    }

    private initWorker() {
        if (!this.workerSupported) {
            return;
        }

        this.initializationPromise = new Promise((resolve, reject) => {
            try {
                this.worker = new Worker('/worker.js');

                const initTimeout = setTimeout(() => {
                    if (!this.isWorkerReady) {
                        console.warn('Worker initialization timeout');
                        this.workerSupported = false;
                        reject(new Error('Worker initialization timeout'));
                    }
                }, 10000);

                this.worker.addEventListener('message', (event) => {
                    const { id, status, output, error } = event.data;

                    if (status === 'ready') {
                        this.isWorkerReady = true;
                        clearTimeout(initTimeout);
                        resolve();
                        return;
                    }

                    const promise = this.pendingPromises.get(id);
                    if (promise) {
                        if (status === 'success') {
                            promise.resolve(output || '');
                        } else {
                            promise.reject(new Error(error || 'Execution failed'));
                        }
                        this.pendingPromises.delete(id);
                    }
                });

                this.worker.addEventListener('error', (event) => {
                    console.error('Worker error:', event);
                    clearTimeout(initTimeout);

                    this.pendingPromises.forEach((promise) => {
                        promise.reject(new Error('Worker failed: ' + event.message));
                    });
                    this.pendingPromises.clear();

                    if (!this.isWorkerReady) {
                        this.workerSupported = false;
                        reject(new Error('Worker failed to initialize'));
                    }

                    this.cleanup();
                });

            } catch (error) {
                console.error('Failed to initialize worker: ', error);
                this.workerSupported = false;
                reject(error);
            }
        });
    }

    private cleanup() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
        }
        this.isWorkerReady = false;
        this.initializationPromise = null;
    }

    private executeFallback(code: string): string {
        const consoleOutput: string[] = [];

        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };

        const mockConsole = {
            log: (...args: any[]) => {
                const output = args.map(arg => {
                    if (typeof arg === 'object') {
                        try {
                            return JSON.stringify(arg);
                        } catch {
                            return String(arg);
                        }
                    }
                    return String(arg);
                }).join(' ');
                consoleOutput.push(output);
                originalConsole.log(output);
            },
            warn: (...args: any[]) => {
                const output = args.map(arg => String(arg)).join(' ');
                consoleOutput.push(`[WARN] ${output}`);
                originalConsole.warn(output);
            },
            error: (...args: any[]) => {
                const output = args.map(arg => String(arg)).join(' ');
                consoleOutput.push(`[ERROR] ${output}`);
                originalConsole.error(output);
            },
            info: (...args: any[]) => {
                const output = args.map(arg => String(arg)).join(' ');
                consoleOutput.push(`[INFO] ${output}`);
                originalConsole.info(output);
            }
        };

        try {
            // Создаем функцию с локальным scope
            const executeFunction = new Function('console', code);
            executeFunction(mockConsole);

            return consoleOutput.join('\n');
        } catch (error) {
            console.error('Fallback execution error:', error);
            return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }

    public async executeCode(code: string): Promise<string> {
        // Если Worker не поддерживается, используем fallback
        if (!this.workerSupported) {
            console.warn('Using fallback execution method');
            return this.executeFallback(code);
        }

        // Ждем инициализации worker'а
        if (this.initializationPromise) {
            try {
                await this.initializationPromise;
            } catch (error) {
                console.warn('Worker initialization failed, using fallback');
                this.workerSupported = false;
                return this.executeFallback(code);
            }
        }

        if (!this.worker || !this.isWorkerReady) {
            console.warn('Worker not ready, using fallback');
            return this.executeFallback(code);
        }

        const id = Date.now().toString() + Math.random().toString().substring(2);

        const promise = new Promise<string>((resolve, reject) => {
            this.pendingPromises.set(id, { resolve, reject });

            const timeoutId = setTimeout(() => {
                this.pendingPromises.delete(id);
                reject(new Error('Code execution timed out'));
            }, 15000);

            const originalResolve = resolve;
            const originalReject = reject;

            const wrappedResolve = (value: string) => {
                clearTimeout(timeoutId);
                originalResolve(value);
            };

            const wrappedReject = (reason: any) => {
                clearTimeout(timeoutId);
                originalReject(reason);
            };

            this.pendingPromises.set(id, {
                resolve: wrappedResolve,
                reject: wrappedReject
            });
        });

        try {
            this.worker.postMessage({ code, id });
            return await promise;
        } catch (error) {
            this.pendingPromises.delete(id);
            console.warn('Worker execution failed, using fallback');
            return this.executeFallback(code);
        }
    }

    public terminate() {
        this.cleanup();
        this.pendingPromises.clear();
    }
}

const codeExecutorService = new CodeExecutorService();

export default codeExecutorService;