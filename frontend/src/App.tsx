import { useCallback, useEffect, useState } from "react"
import useCodeExecution from "./hooks/useCodeExecution";
import { generateTaskWithDifficulty } from "./services/codeGenerator";
import { ITask } from "./types";
import styles from './App.module.scss'
import DifficultySelector from "./components/DifficultySelector/DifficultySelector";
import Header from "./components/Header/Header";
import CodeDisplay from "./components/CodeDisplay/CodeDisplay";
import Button from "./components/Button/Button";
import AnswerInput from "./components/AnswerInput/AnswerInput";
import ResultDisplay from "./components/ResultDisplay/ResultDisplay";


const App: React.FC = () => {
  const [currentTask, setCurrentTask] = useState<ITask | null>(null);
  const [expectedOutput, setExpectedOutput] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{ output: string; isCorrect: boolean } | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialExecution, setIsInitialExecution] = useState<boolean>(false);

  const { executeCode, loading: executionLoading, error } = useCodeExecution();

  // Загрузка задачи при первом рендере и при изменении сложности 
  useEffect(() => {
    loadNewTask();
  }, [difficulty]);

  const getExpextedOutput = useCallback(async (code: string, taskId: string) => {
    if (!currentTask || currentTask.id !== taskId) {
      return;
    }

    setIsInitialExecution(true);
    try {
      const output = await executeCode(code);

      if (currentTask && currentTask.id === taskId) {
        setExpectedOutput(output.trim());
      }
    } catch (err) {
      console.error("Error executing code to get expected output", err);

      if (currentTask && currentTask.id === taskId) {
        setExpectedOutput('');
      }
    } finally {
      setIsInitialExecution(false);
    }
  }, [executeCode, currentTask])

  const loadNewTask = useCallback(async () => {
    setIsLoading(true);
    setExpectedOutput('');
    setUserAnswer('');
    setIsSubmitted(false);
    setResult(null);// Сбрасываем ожидаемый вывод при загрузке новой задачи

    try {
      const task = await generateTaskWithDifficulty(difficulty);
      setCurrentTask(task);

      setTimeout(() => {
        getExpextedOutput(task.code, task.id);
      }, 100)
    } catch (err) {
      console.error('Error loading task', err)
    } finally {
      setIsLoading(false);
    }
  }, [difficulty, getExpextedOutput]);

  const handleSubmit = async () => {
    if (!currentTask || executionLoading || isLoading || isInitialExecution) return;

    setIsSubmitted(true)
    // Используем предвартельно полученный ожидаемый вывод вместо повторного выполнения кода
    if (expectedOutput !== '') {
      // Нормализуем обе строки для сравнения
      const normalizedExpectedOutput = expectedOutput.trim();
      const normalizedUserAnswer = userAnswer.trim();

      setResult({
        output: normalizedExpectedOutput,
        isCorrect: normalizedUserAnswer === normalizedExpectedOutput
      });
    } else {
      // Если ожидаемвй вывод не получен, выполняем код снова
      try {
        const output = await executeCode(currentTask.code);
        const normalizedOutput = output.trim();
        const normalizedUserAnswer = userAnswer.trim();

        setResult({
          output: normalizedOutput,
          isCorrect: normalizedUserAnswer === normalizedOutput
        });
      } catch (err) {
        console.error('Error executin code', err);
        setResult({
          output: 'Error executing code',
          isCorrect: false
        });
      }
    }
  };

  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    if (newDifficulty !== difficulty && !isSubmitted && !isLoading && !isInitialExecution) {
      setDifficulty(newDifficulty);
    }
  };

  const handleNext = () => {
    loadNewTask();
  }

  const loading = isLoading || executionLoading || isInitialExecution;

  if (isLoading && !currentTask) {
    return <div className={styles.loading}>Загрузка задачи...</div>;
  }

  if (!currentTask) {
    return <div className={styles.loading}>Не удалось загрузить задачу. Пожалуйста, обновите страницу.</div>
  }

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <DifficultySelector
            value={difficulty}
            onChange={handleDifficultyChange}
            disabled={isSubmitted || loading}
          />
          <CodeDisplay code={currentTask.code} />

          <div className={styles.answerSection}>
            <AnswerInput
              value={userAnswer}
              onChange={setUserAnswer}
              disabled={isSubmitted || loading}
              placeholder='Введите ожидаемый вывод консоли...'
            />

            {!isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={loading || userAnswer.trim() === ''}
                className={styles.submitButton}
              >
                {loading ? 'Загрузка...' : 'Проверить ответ'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className={styles.nextButton}
              >
                Следующая задача
              </Button>
            )}
          </div>

          {isSubmitted && result && (
            <ResultDisplay
              expectedOutput={result.output}
              userAnswer={userAnswer}
              isCorrect={result.isCorrect}
            />
          )}

          {error && <div className={styles.error}>{error}</div>}

          {loading && !isSubmitted && (
            <div className={styles.loadingIndicator}>
              {isInitialExecution ? 'Анализируем код...' : 'Загрузка...'}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App;
