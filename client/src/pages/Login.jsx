// client/src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import GoogleLoginButton from '../components/GoogleLoginButton.jsx';

// Basic email validation (lightweight, client-side)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
    const [email, setEmail] = useState('');
    const [emailTouched, setEmailTouched] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const trimmedEmail = email.trim();
    const isEmailValid = trimmedEmail !== '' && emailRegex.test(trimmedEmail);
    const showEmailError = trimmedEmail !== '' && !emailRegex.test(trimmedEmail);
    const canSubmit = isEmailValid && password.length > 0;

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!isEmailValid) {
            setEmailTouched(true);
            setError('Please enter a valid email address');
            return;
        }
        try {
            await login(trimmedEmail, password);
            navigate('/');
        } catch (e) {
            setError(e?.response?.data?.message ?? 'Invalid email or password');
        }
    };

    // if a user is present (e.g., after Google sign-in), leave this page
    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    return (
        <div className="card">
            <h2>Login</h2>
            <form className="auth" onSubmit={onSubmit} noValidate>
                <input
                    placeholder="Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    //   onBlur={() => setEmailTouched(true)}
                    //   className={!isEmailValid && emailTouched ? 'invalid' : ''}
                    //   aria-invalid={!isEmailValid && emailTouched}
                    //   aria-describedby={!isEmailValid && emailTouched ? 'email-error' : undefined}
                    className={showEmailError ? 'invalid' : ''}
                    aria-invalid={showEmailError}
                    aria-describedby={showEmailError ? 'email-error' : undefined}
                />
                {showEmailError && (
                    <div id="email-error" className="error">
                        Enter a valid email like name@example.com
                    </div>
                )}

                <input
                    placeholder="Password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <div className="error">{error}</div>}

                <button type="submit" disabled={!canSubmit}>
                    Login
                </button>

                <div>
                    No account? <Link to="/register">Register</Link>
                </div>
            </form>
            <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                <div style={{ textAlign: 'center', opacity: 0.8 }}>or</div>
                <GoogleLoginButton />
            </div>
        </div>
    );
}

