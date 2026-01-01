import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Mail, ArrowRight } from 'lucide-react';
import NeonButton from '../components/atoms/NeonButton';
import TechInput from '../components/atoms/TechInput';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes';

/**
 * LoginPage Component
 * 
 * Handles User Authentication (Login & Register).
 * Adapts UI based on the URL path.
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, register } = useAuth();

    // Determine mode based on URL
    const isLogin = location.pathname !== ROUTES.SIGNUP;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            // Redirect to Dashboard on success
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center mt-16 p-4 overflow-hidden">
            {/* Background Effects */}

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass p-4 rounded-2xl border border-text-main/10 shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text-main mb-2">
                        {isLogin ? 'Welcome Back' : 'Initialize Identity'}
                    </h1>
                    <p className="text-text-muted text-sm">
                        {isLogin ? 'Enter your credentials to access the system.' : 'Create a new secure profile.'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <TechInput
                            label="Username"
                            name="name"
                            placeholder="e.g. Neo"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    )}

                    <TechInput
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <TechInput
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="pt-4">
                        <NeonButton
                            type="submit"
                            variant="primary"
                            className="w-full justify-center"
                            isLoading={isLoading}
                        >
                            {isLogin ? 'Access System' : 'Register Identity'} <ArrowRight className="w-4 h-4" />
                        </NeonButton>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate(isLogin ? ROUTES.SIGNUP : ROUTES.LOGIN)}
                        className="text-xs text-text-muted hover:text-primary transition-colors underline decoration-dotted"
                    >
                        {isLogin ? "Don't have an account? Create one." : "Already have an identity? Login."}
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

export default LoginPage;
