import React from 'react'
import styles from './CodeDisplay.module.scss'

interface ICodeDisplayProps {
    code: string;
    className?: string
}

const CodeDisplay: React.FC<ICodeDisplayProps> = ({ code, className }) => {
    const highlightSyntax = (code: string): string => {
        return code
            .replace(/(let|const|var|function|if|else|for|while|do|switch|return|try|catch|new|this|typeof)/g, '<span class="keyword">$1</span>')
            .replace(/([0-9]+)/g, '<span class="number">$1</span>')
            .replace(/(["'`])(.*?)\1/g, '<span class="string">$1$2$1</span>')
            .replace(/(\/\/.*)$/gm, '<span class="comment">$1</span>')
            .replace(/(console\.log)/g, '<span class="console">$1</span>')
            .replace(/(setTimeout|Promise)/g, '<span class="async">$1</span>');
    }
    return (
        <div>

        </div>
    )
}

export default CodeDisplay
