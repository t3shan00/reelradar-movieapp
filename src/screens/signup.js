import React, { useState } from 'react';
import './authentication.css';

const Signup = () => {
    const [isUsernameFocused, setUsernameFocused] = useState(false);
    const [isPasswordFocused, setPasswordFocused] = useState(false);

    return (
        <div className="login-container">
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

                <p><a href="/login" className="signup-link">Already have an account? Log in.</a></p>
                <button className="login-button">Register</button>
            </div>
        </div>
    );
};

export default Signup;