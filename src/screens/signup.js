import React, { useState } from 'react';
import styles from './styles/authentication.module.css';

const Signup = () => {
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

                <p><a href="/login" className={styles.signupLink}>Already have an account? Log in.</a></p>
                <button className={styles.loginButton}>Register</button>
            </div>
        </div>
    );
};

export default Signup;