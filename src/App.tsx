import { useEffect, useState } from "react"
import useCodeExecution from "./hooks/useCodeExecution";
import { generateTaskWithDifficulty } from "./services/codeGenerator";
import { ITask } from "./types";

const App: React.FC = () => {
  const [currentTask, setCurretTask] = useState<ITask | null>(null);
  const [expectedOutput, setExpectedOutput] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{ output: string; isCorrect: boolean } | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialExecution, setIsInitialExecution] = useState<boolean>(false);

  const { executeCode, loading: executionLoading } = useCodeExecution();

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
}
