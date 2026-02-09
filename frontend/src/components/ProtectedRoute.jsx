import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        if (user.role === 'HR') return <Navigate to="/hr/plans" replace />;
        if (user.role === 'Manager') return <Navigate to="/manager/plans" replace />;
        if (user.role === 'Pharmacist') return <Navigate to="/me/today" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
}
