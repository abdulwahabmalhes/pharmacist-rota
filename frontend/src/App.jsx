import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Pharmacists from './pages/hr/Pharmacists';
import Pharmacies from './pages/hr/Pharmacies';
import Availability from './pages/hr/Availability';
import HRPlans from './pages/hr/Plans';
import ManagerPlans from './pages/manager/Plans';
import MyToday from './pages/pharmacist/MyToday';

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }>
                {/* Index route - redirect based on role */}
                <Route index element={
                    user?.role === 'HR' ? <Navigate to="/hr/plans" replace /> :
                        user?.role === 'Manager' ? <Navigate to="/manager/plans" replace /> :
                            <Navigate to="/me/today" replace />
                } />

                {/* HR Routes */}
                <Route path="hr/pharmacists" element={
                    <ProtectedRoute allowedRoles={['HR']}>
                        <Pharmacists />
                    </ProtectedRoute>
                } />
                <Route path="hr/pharmacies" element={
                    <ProtectedRoute allowedRoles={['HR']}>
                        <Pharmacies />
                    </ProtectedRoute>
                } />
                <Route path="hr/availability" element={
                    <ProtectedRoute allowedRoles={['HR']}>
                        <Availability />
                    </ProtectedRoute>
                } />
                <Route path="hr/plans" element={
                    <ProtectedRoute allowedRoles={['HR']}>
                        <HRPlans />
                    </ProtectedRoute>
                } />

                {/* Manager Routes */}
                <Route path="manager/plans" element={
                    <ProtectedRoute allowedRoles={['Manager']}>
                        <ManagerPlans />
                    </ProtectedRoute>
                } />

                {/* Pharmacist Routes */}
                <Route path="me/today" element={
                    <ProtectedRoute allowedRoles={['Pharmacist']}>
                        <MyToday />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
