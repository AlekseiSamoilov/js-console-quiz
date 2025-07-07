import React from 'react'
import styles from './Button.module.scss'

interface IBUttonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
}

const Button: React.FC<IBUttonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    type = 'button',
    ...rest
}) => {
    const buttonClasses = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        className || ''
    ].filter(Boolean).join(' ');
    return (
        <button
            className={buttonClasses}
            disabled={disabled}
            type={type}
            {...rest}
        >
            {children}
        </button>
    )
}

export default Button
