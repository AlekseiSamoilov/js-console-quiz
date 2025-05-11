import codeExecutorService from "@/services/codeExecutor";
import { useCallback, useEffect, useState } from "react";

interface IUseCodeExecutionReturn {
    executeCode: (code: string) => Promise<string>;
    loading: boolean;
    error: string | null;
}

const useCodeExecution = (): IUseCodeExecutionReturn => {
    const [loading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            codeExecutorService.terminate();
        };
    }, []);

    const executeCode = useCallback(async (code: string): Promise<string> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await codeExecutorService.executeCode(code);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        executeCode,
        loading,
        error,
    };
};

export default useCodeExecution;