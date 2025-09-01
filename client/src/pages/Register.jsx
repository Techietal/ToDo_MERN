import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = useAuth();


    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(email, password);
            navigate('/');
        } catch (e) {
            setError('Registration failed');
        }
    };


    return (
        <div className="card">
            <h2>Register</h2>
            <form className="auth" onSubmit={onSubmit}>
                <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password (min 6)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <div className="error">{error}</div>}
                <button type="submit">Create account</button>
                <div>
                    Have an account? <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    );
}