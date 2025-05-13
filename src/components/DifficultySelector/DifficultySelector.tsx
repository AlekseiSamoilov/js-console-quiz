type Difficulty = 'easy' | 'medium' | 'hard';
import styles from './DifficultySelector.module.scss'

interface IDifficultySelectorProps {
    value: Difficulty;
    onChange: (difficulty: Difficulty) => void;
    disabled?: boolean;
}

const DifficultySelector: React.FC<IDifficultySelectorProps> = ({
    value,
    onChange,
    disabled = false,
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value as Difficulty);
    };

    return (
        <div className={styles.difficultySelector}>
            <span className={styles.label}>Сложность:</span>

            <div className={styles.options}>
                <label className={`${styles.option} ${value === 'easy' ? styles.selected : ''}`}>
                    <input
                        type="radio"
                        name="difficulty"
                        value="easy"
                        checked={value === 'easy'}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <span className={styles.text}>Легко</span>
                </label>

                <label className={`${styles.option} ${value === 'medium' ? styles.selected : ''}`}>
                    <input
                        type="radio"
                        name="difficulty"
                        value="medium"
                        checked={value === 'medium'}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <span className={styles.text}>Среднее</span>
                </label>

                <label className={`${styles.option} ${value === 'hard' ? styles.selected : ''}`}>
                    <input
                        type="radio"
                        name="difficulty"
                        value="hard"
                        checked={value === 'hard'}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                    <span className={styles.text}>Сложно</span>
                </label>
            </div>
        </div>
    );
};

export default DifficultySelector;