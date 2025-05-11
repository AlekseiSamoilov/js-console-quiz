import { useState } from "react"

const App: React.FC = () => {
  const [currentTask, setCurretTask] = useState<ITask | null>(null);
  const [expectedOutput, setExpectedOutput] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{ output: string; isCorrect: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialExecution, setIsInitialExecution] = useState<boolean>(false);


}
