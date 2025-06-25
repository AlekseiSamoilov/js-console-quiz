import React from 'react'
import styles from './AnswerInput.module.scss'

interface IAnswerInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

const AnswerInput: React.FC<IAnswerInputProps> = ({
    value,
    onChange,
    disabled = false,
    placeholder = 'Введите ваш ответ...',
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className={styles.answerInput}>
            <label className={styles.label}>Ваш ответ:</label>
            <textarea
                className={styles.textarea}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                placeholder={placeholder}
                rows={4}
                spellCheck={false}
                autoComplete='off'
            />
            <div className={styles.hint}>
                Введите то, что по вашему мнению выведет console.log (каждый вывод с новой строки)
            </div>
        </div>
    );
};

export default AnswerInput
