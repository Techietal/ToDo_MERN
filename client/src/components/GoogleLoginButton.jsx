// client/src/components/GoogleLoginButton.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function GoogleLoginButton() {
    const btnRef = useRef(null);
    const { user, setUserFromAuthResponse } = useAuth();
    const navigate = useNavigate();

    // derive current theme from <html data-theme="..."> or system preference
    const getTheme = () => {
        const attr = document.documentElement.getAttribute('data-theme');
        if (attr === 'dark' || attr === 'light') return attr;
        return window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    };

    useEffect(() => {
        if (!window.google || !btnRef.current || user) return;

        const render = () => {
            // map app theme -> Google button theme
            const appTheme = getTheme();
            const gisTheme = appTheme === 'dark' ? 'filled_black' : 'filled_blue';

            // avoid double render during hot-reload
            btnRef.current.innerHTML = '';

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: async (response) => {
                    try {
                        const { data } = await api.post('/auth/google', { credential: response.credential });
                        setUserFromAuthResponse(data);
                        navigate('/'); // go to app after success
                    } catch (e) {
                        alert(e?.response?.data?.message ?? 'Google sign-in failed');
                    }
                }
            });

            window.google.accounts.id.renderButton(btnRef.current, {
                type: 'standard',
                theme: gisTheme,     // <-- theming hook (dark -> filled_black, light -> filled_blue)
                size: 'large',
                shape: 'pill',
                text: 'signin_with',
                logo_alignment: 'left',
                width: 280          // adjust width as you like
            });
        };

        // initial render
        render();

        // re-render on theme changes (observe <html data-theme="...">)
        const observer = new MutationObserver((muts) => {
            for (const m of muts) {
                if (m.type === 'attributes' && m.attributeName === 'data-theme') {
                    render();
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        return () => observer.disconnect();
    }, [user, navigate, setUserFromAuthResponse]);

    // centered wrapper (inline styles, no extra CSS file needed)
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div ref={btnRef} style={{ width: 280 }} />
        </div>
    );
}
