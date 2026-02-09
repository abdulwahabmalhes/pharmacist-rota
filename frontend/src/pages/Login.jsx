import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);

            // Redirect based on role
            if (user.role === 'HR') navigate('/hr/plans');
            else if (user.role === 'Manager') navigate('/manager/plans');
            else navigate('/me/today');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const demoLogins = [
        { email: 'hr@demo.com', password: 'Password123!', role: 'HR' },
        { email: 'manager@demo.com', password: 'Password123!', role: 'Manager' },
        { email: 'pharm@demo.com', password: 'Password123!', role: 'Pharmacist' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">💊 Pharmacist Rota</h1>
                    <p className="text-gray-500 mt-2">AI-Driven Visit Planner Demo</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Email</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-3"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500 text-center mb-4">Demo Accounts (click to autofill)</p>
                    <div className="space-y-2">
                        {demoLogins.map((demo) => (
                            <button
                                key={demo.email}
                                onClick={() => {
                                    setEmail(demo.email);
                                    setPassword(demo.password);
                                }}
                                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-all"
                            >
                                <span className="font-medium text-gray-700">{demo.role}:</span>{' '}
                                <span className="text-gray-500">{demo.email}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
