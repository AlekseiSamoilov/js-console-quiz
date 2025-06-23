import React from 'react'
import styles from './Header.module.scss'

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <h1 className={styles.title}>JS Console Quiz</h1>
                <div className={styles.subtitle}>
                    Угадай, что выведет JavaScript
                </div>
            </div>
        </header>
    )
}

export default Header
