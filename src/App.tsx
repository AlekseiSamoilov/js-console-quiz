import { useEffect, useState } from "react"
import useCodeExecution from "./hooks/useCodeExecution";
import { generateTaskWithDifficulty } from "./services/codeGenerator";
import { ITask } from "./types";
import styles from './App.module.scss'
import DifficultySelector from "./components/DifficultySelector/DifficultySelector";
import Header from "./components/Header/Header";
import CodeDisplay from "./components/CodeDisplay/CodeDisplay";


const App: React.FC = () => {
  const [currentTask, setCurretTask] = useState<ITask | null>(null);
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

  // Выполняем код для получения ожидаемого результата после создания задачи
  useEffect(() => {
    if (currentTask && currentTask.code && !expectedOutput && !isInitialExecution) {
      getExpextedOutput(currentTask.code);
    }
  }, [currentTask, expectedOutput, isInitialExecution]);


  const getExpextedOutput = async (code: string) => {
    setIsInitialExecution(true);
    try {
      const output = await executeCode(code);
      setExpectedOutput(output.trim())
    } catch (err) {
      console.error("Error execution code for expected output", err);
    } finally {
      setIsInitialExecution(false);
    }
  };

  const loadNewTask = async () => {
    setIsLoading(true);
    setExpectedOutput(''); // Сбрасываем ожидаемый вывод при загрузке новой задачи

    try {
      const task = await generateTaskWithDifficulty(difficulty);
      setCurretTask(task);
      setUserAnswer('');
      setIsSubmitted(false);
      setResult(null);
    } catch (err) {
      console.error('Error loading task', err)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentTask || executionLoading || isLoading || isInitialExecution) return;

    // Используем предвартельно полученный ожидаемый вывод вместо повторного выполнения кода
    if (expectedOutput) {
      setIsSubmitted(true);

      // Нормализуем обе строки для сравнения
      const normalizedExpectedOutput = expectedOutput.trim();
      const normalizedUserAnswer = userAnswer.trim();

      setResult({
        output: normalizedExpectedOutput,
        isCorrect: normalizedUserAnswer === normalizedExpectedOutput
      });
    } else {
      // Если ожидаемвй вывод не получен, выполняем код снова
      setIsSubmitted(true);

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
    if (newDifficulty !== difficulty && !isSubmitted) {
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

            {isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={loading || userAnswer.trim() === ''}
                className={styles.submitButton}
              >
                {loading ? 'Загрузка...' : 'Проверить ответ'}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
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
