import React, { useState } from 'react';
import './authentication.css';

const Authentication = () => {
    const [isUsernameFocused, setUsernameFocused] = useState(false);
    const [isPasswordFocused, setPasswordFocused] = useState(false);

    return (
        <div className="login-container">
            <h1>ReelRadar</h1>
            <div className="login-box">
                <div className="input-group">
                    <label className={`floating-label ${isUsernameFocused ? 'focused' : ''}`}>
                        Username
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        onFocus={() => setUsernameFocused(true)}
                        onBlur={(e) => setUsernameFocused(e.target.value !== '')}
                    />
                </div>

                <div className="input-group">
                    <label className={`floating-label ${isPasswordFocused ? 'focused' : ''}`}>
                        Password
                    </label>
                    <input
                        type="password"
                        className="input-field"
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={(e) => setPasswordFocused(e.target.value !== '')}
                    />
                </div>

                <p><a href="/signup" className="signup-link">Don't have an account? Sign up.</a></p>
                <button className="login-button">Login</button>
            </div>
        </div>
    );
};

export default Authentication;
