import React from 'react'
import styles from './CodeDisplay.module.scss'

interface ICodeDisplayProps {
    code: string;
    className?: string
}

const CodeDisplay: React.FC<ICodeDisplayProps> = ({ code, className }) => {
    const highlightSyntax = (code: string): string => {

        let highlightedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, 'gt;')

        highlightedCode = highlightedCode
            .replace(/(\/\/.*?)$/gm, '<span class="comment">$1</span>')

            // Строки (тоже должны быть рано, чтобы не подсвечивать содержимое)
            .replace(/(["'`])([^"'`\n]*?)\1/g, '<span class="string">$1$2$1</span>')

            // Ключевые слова (только целые слова)
            .replace(/\b(let|const|var|function|if|else|for|while|do|switch|case|break|continue|return|try|catch|finally|new|this|typeof|instanceof|in|of)\b/g, '<span class="keyword">$1</span>')

            // Числа (только целые числа и десятичные дроби)
            .replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>')

            // console методы
            .replace(/\b(console)\s*\.\s*(log|warn|error|info|debug|trace)\b/g, '<span class="console">$1.$2</span>')

            // Асинхронные функции и методы
            .replace(/\b(setTimeout|setInterval|Promise|async|await)\b/g, '<span class="async">$1</span>');

        return highlightedCode;
    }

    return (
        <div className={`${styles.codeDisplay} ${className || ''}`}>
            <div className={styles.header}>
                <span className={styles.title}>Что выведется в консоль?</span>
            </div>
            <pre className={styles.codeBlock}>
                <code dangerouslySetInnerHTML={{ __html: highlightSyntax(code) }} />
            </pre>
        </div>
    )
}

export default CodeDisplay
