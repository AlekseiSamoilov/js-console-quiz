import React from 'react'
import styles from './ResultDisplay.module.scss'

interface IResultDisplayProps {
    expectedOutput: string;
    userAnswer: string;
    isCorrect: boolean;
}

const ResultDisplay: React.FC<IResultDisplayProps> = ({
    expectedOutput,
    userAnswer,
    isCorrect
}) => {
    const normalizeString = (str: string) => str.trim().split('\n').map(line => line.trim());

    const expectedLines = normalizeString(expectedOutput);
    const userLines = normalizeString(userAnswer);

    const lineDifferences = expectedLines.map((expectedLine, index) => {
        const userLine = userLines[index] || '';
        return {
            expected: expectedLine,
            user: userLine,
            isMatch: expectedLine === userLine
        };
    });

    for (let i = expectedLines.length; i < userLines.length; i++) {
        lineDifferences.push({
            expected: '',
            user: userLines[i],
            isMatch: false
        });
    }
    return (
        <div className={`${styles.ResultDisplay} ${isCorrect ? styles.correct : styles.incorrect}`}>
            <div className={styles.statusIcon}>
                {isCorrect ? '✓' : '✗'}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>
                    {isCorrect ? 'Правильно!' : 'Неправильно'}
                </h3>

                <div className={styles.outputComparison}>
                    <div className={styles.column}>
                        <h4 className={styles.columnHeader}>Ожидаемый вывод:</h4>
                        <pre className={styles.output}>
                            {expectedOutput || '(нет вывода)'}
                        </pre>
                    </div>

                    <div className={styles.column}>
                        <h4 className={styles.columnHeader}>Ваш ответ:</h4>
                        <pre className={styles.output}>
                            {userAnswer || '(нет вывода)'}
                        </pre>
                    </div>
                </div>

                {!isCorrect && lineDifferences.some(diff => !diff.isMatch) && (
                    <div className={styles.differences}>
                        <h4 className={styles.diffHeader}>Различия:</h4>
                        <ul className={styles.diffList}>
                            {lineDifferences.map((diff, index) =>
                                !diff.isMatch && (
                                    <li key={index} className={styles.diffItem}>
                                        <span className={styles.lineNumber}>Строка {index + 1}:</span>
                                        {diff.expected ?
                                            <span>
                                                Ожидалось <code>"{diff.expected}"</code>,
                                                получено <code>"{diff.user || '(пусто)'}"</code>
                                            </span>
                                            :
                                            <span>
                                                Лишняя строка <code>"{diff.user}"</code>
                                            </span>
                                        }
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultDisplay
