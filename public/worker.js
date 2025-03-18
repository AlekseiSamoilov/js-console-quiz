const { output } = require("three/tsl");

const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
};

let consoleOutput = [];

console.log = (...args) => {
    const output = args.map(arg => {
        if (typeof arg === 'object') {
            return JSON.stringify(arg);
        }
        return String(arg);
    }).join(' ');

    consoleOutput.push(output);
    originalConsole.log(output);
};

console.warn = (...args) => {
    const output = args.map(arg => String(arg)).join(' ');
    consoleOutput.push(`[WARN] ${output}`);
    originalConsole.warn(output);
};

console.error = (...args) => {
    const output = args.map(arg => String(arg)).join(' ');
    consoleOutput.push(`[ERROR] ${output}`);
    originalConsole.error(output);
};

console.info = (...args) => {
    const output = args.map(arg => String(arg)).join(' ');
    consoleOutput.push(`[INFO] ${output}`);
    originalConsole.info(output);
};

self.addEventListener('message', event => {
    const { code, id } = event.data;

    consoleOutput = [];

    try {
        const timeoutId = setTimeout(() => {
            throw new Error('Execution times out after 5 seconds');
        }, 5000);

        eval(code);

        clearTimeout(timeoutId);

        self.postMessage({
            id,
            status: 'success',
            output: consoleOutput.join('\n')
        });
    } catch (error) {
        self.postMessage({
            id,
            status: 'error',
            error: error.message,
            output: consoleOutput.join('\n')
        });
    }
});

self.postMessage({ status: 'ready' });