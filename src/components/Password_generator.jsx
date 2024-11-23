import React, { useState, useCallback, useEffect, useRef } from 'react';
import './Password_generator.css';

const PasswordGenerator = () => {
    const [length, setLength] = useState(6);
    const [numAllowed, setNumAllowed] = useState(false);
    const [charAllowed, setCharAllowed] = useState(false);
    const [password, setPassword] = useState('');
    const passwordListRef = useRef([]);
    const [currentPasswordIndex, setCurrentPasswordIndex] = useState(-1);
    const passwordInputRef = useRef(null);
    const [copied, setCopied] = useState(false); 

    const passwordGenerator = useCallback(() => {
        if (currentPasswordIndex === passwordListRef.current.length - 1) {
            let pass = '';
            let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

            if (numAllowed) str += '0123456789';
            if (charAllowed) str += '@#$.&%!';

            for (let i = 0; i < length; i++) {
                let char = Math.floor(Math.random() * str.length);
                pass += str.charAt(char);
            }

            passwordListRef.current.push(pass);
            setCurrentPasswordIndex(passwordListRef.current.length - 1);
            setPassword(pass);
        } else {
            const newIndex = currentPasswordIndex + 1;
            setCurrentPasswordIndex(newIndex);
            setPassword(passwordListRef.current[newIndex]);
        }
    }, [length, numAllowed, charAllowed, currentPasswordIndex, setPassword]);

    const showPreviousPassword = () => {
        if (currentPasswordIndex > 0) {
            const newIndex = currentPasswordIndex - 1;
            setCurrentPasswordIndex(newIndex);
            setPassword(passwordListRef.current[newIndex]);
        }
    };

    const copyPasswordToClipboard = useCallback(() => {
        passwordInputRef.current?.select();
        window.navigator.clipboard.writeText(password);
        setCopied(true); 
        
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }, [password]);

    useEffect(() => {
        passwordGenerator();
    }, []);

    return (
        <div className="container">
            <h1 className="title">Password Generator</h1>
            <div className="input-container">
                <input
                    type="text"
                    value={password}
                    className="password-input"
                    placeholder="Password"
                    readOnly
                    ref={passwordInputRef}
                />
                <button className="copy-button" onClick={copyPasswordToClipboard}>
                    Copy
                </button>
                 <div className={`copied-message ${copied ? 'show' : ''}`}>Copied!</div>
            </div>

            <div className="options">
                <label>
                    Length: {length}
                    <input
                        type="range"
                        min={6}
                        max={20}
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                    />
                </label>
                <label>
                    Numbers
                    <input
                        type="checkbox"
                        checked={numAllowed}
                        onChange={() => setNumAllowed((prev) => !prev)}
                    />
                </label>
                <label>
                    Characters
                    <input
                        type="checkbox"
                        checked={charAllowed}
                        onChange={() => setCharAllowed((prev) => !prev)}
                    />
                </label>
            </div>

            <div className="button-container">
                <button className="prev-button" onClick={showPreviousPassword} disabled={currentPasswordIndex === 0}>
                    Previous
                </button>
                <button className="next-button" onClick={passwordGenerator}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default PasswordGenerator;
