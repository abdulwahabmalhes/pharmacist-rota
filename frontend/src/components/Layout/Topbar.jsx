import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'HR': return 'bg-purple-100 text-purple-800';
            case 'Manager': return 'bg-blue-100 text-blue-800';
            case 'Pharmacist': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Welcome back, {user?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user?.role)}`}>
                        {user?.role}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="btn btn-secondary text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
