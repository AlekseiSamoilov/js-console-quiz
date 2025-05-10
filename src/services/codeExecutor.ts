class CodeExecutorService {
    private worker: Worker | null = null;
    private isWorkerReady: boolean = false;
    private pendingPromises = new Map<string, {
        resolve: (value: string) => void;
        reject: (reason: any) => void;
    }>();

    constructor() {
        this.initWorker();
    }

    private initWorker() {
        if (typeof window === 'undefined' || typeof Worker === 'undefined') {
            return;
        }

        try {
            this.worker = new Worker('/worker.js');

            this.worker.addEventListener('message', (event) => {
                const { id, status, output, error } = event.data;

                if (status === 'ready') {
                    this.isWorkerReady = true;
                    return;
                }

                const promise = this.pendingPromises.get(id);
                if (promise) {
                    if (status === 'success') {
                        promise.resolve(output);
                    } else {
                        promise.reject(new Error(error || 'Execution failed'));
                    }
                    this.pendingPromises.delete(id);
                }
            });

            this.worker.addEventListener('error', (event) => {
                console.error('Worker error:', event);

                this.pendingPromises.forEach((promise) => {
                    promise.reject(new Error('Worker failed: ' + event.message));
                });
                this.pendingPromises.clear();

                this.worker?.terminate();
                this.worker = null;
                this.isWorkerReady = false;
                this.initWorker();
            });
        } catch (error) {
            console.error('Failed to initialize worker: ', error);
        }
    }

    public async executeCode(code: string): Promise<string> {
        if (!this.worker) {
            throw new Error('Web Worker not available');
        }

        if (!this.isWorkerReady) {
            await new Promise<void>((resolve) => {
                const checkReady = () => {
                    if (this.isWorkerReady) {
                        resolve();
                    } else {
                        setTimeout(checkReady, 50);
                    }
                };
                checkReady();
            });
        }

        const id = Date.now().toString() + Math.random().toString().substring(2);

        const promise = new Promise<string>((resolve, reject) => {
            this.pendingPromises.set(id, { resolve, reject });

            const timeoutId = setTimeout(() => {
                this.pendingPromises.delete(id);
                reject(new Error('Execution timed out after 10 seconds'));
            }, 10000);

            const originalResolve = resolve;
            resolve = ((value: string) => {
                clearTimeout(timeoutId);
                originalResolve(value);
            }) as typeof resolve;
        });

        this.worker.postMessage({ code, id });
        return promise;
    }

    public terminate() {
        this.worker?.terminate();
        this.worker = null;
        this.isWorkerReady = false;
        this.pendingPromises.clear();
    }
}

const codeExecutorService = new CodeExecutorService();

export default codeExecutorService;