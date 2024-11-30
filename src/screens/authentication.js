import React, { useState } from 'react';
import styles from './styles/authentication.module.css';

const Authentication = () => {
    const [isUsernameFocused, setUsernameFocused] = useState(false);
    const [isPasswordFocused, setPasswordFocused] = useState(false);

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div className={styles.inputGroup}>
                    <label className={`${styles.floatingLabel} ${isUsernameFocused ? styles.focused : ''}`}>
                        Username
                    </label>
                    <input
                        type="text"
                        className={styles.inputField}
                        onFocus={() => setUsernameFocused(true)}
                        onBlur={(e) => setUsernameFocused(e.target.value !== '')}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={`${styles.floatingLabel} ${isPasswordFocused ? styles.focused : ''}`}>
                        Password
                    </label>
                    <input
                        type="password"
                        className={styles.inputField}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={(e) => setPasswordFocused(e.target.value !== '')}
                    />
                </div>

                <button className={styles.loginButton}>Login</button>
            </div>
        </div>
    );
};

export default Authentication;