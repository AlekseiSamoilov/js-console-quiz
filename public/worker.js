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
}