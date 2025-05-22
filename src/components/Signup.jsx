import { useState } from 'react';

export default function Signup({ onSignup }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        try {
            const response = await fetch('https://quiz-app-backend-tqxv.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Signup failed');
                return;
            }

            onSignup(data.user);
        } catch (err) {
            setError('Signup failed. Server error.');
        }
    };

    return (
        <div className="auth-form">
            <h2>Signup</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
}
