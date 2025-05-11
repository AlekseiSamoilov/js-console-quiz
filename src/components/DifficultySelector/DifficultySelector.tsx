type Difficulty = 'easy' | 'medium' | 'hard';

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
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value as Difficulty);
    };

    return (
        <div className={styles.difficultySelector}></div>
    )
}