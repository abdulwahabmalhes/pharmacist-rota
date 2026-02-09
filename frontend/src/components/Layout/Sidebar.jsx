import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
    const { user, isHR, isManager, isPharmacist } = useAuth();

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`;

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
            <div className="mb-8">
                <h1 className="text-xl font-bold text-primary-600">💊 Pharmacist Rota</h1>
                <p className="text-xs text-gray-500 mt-1">Demo Application</p>
            </div>

            <nav className="space-y-2">
                {isHR && (
                    <>
                        <p className="text-xs uppercase text-gray-400 font-semibold px-4 mt-6 mb-2">HR Management</p>
                        <NavLink to="/hr/pharmacists" className={linkClass}>
                            <span>👨‍⚕️</span>
                            <span>Pharmacists</span>
                        </NavLink>
                        <NavLink to="/hr/availability" className={linkClass}>
                            <span>📅</span>
                            <span>Daily Availability</span>
                        </NavLink>
                        <NavLink to="/hr/pharmacies" className={linkClass}>
                            <span>🏥</span>
                            <span>Pharmacies</span>
                        </NavLink>
                        <NavLink to="/hr/plans" className={linkClass}>
                            <span>📋</span>
                            <span>Generate Plans</span>
                        </NavLink>
                    </>
                )}

                {isManager && (
                    <>
                        <p className="text-xs uppercase text-gray-400 font-semibold px-4 mt-6 mb-2">Manager</p>
                        <NavLink to="/manager/plans" className={linkClass}>
                            <span>📊</span>
                            <span>View Plans</span>
                        </NavLink>
                    </>
                )}

                {isPharmacist && (
                    <>
                        <p className="text-xs uppercase text-gray-400 font-semibold px-4 mt-6 mb-2">My Work</p>
                        <NavLink to="/me/today" className={linkClass}>
                            <span>🗓️</span>
                            <span>My Plan Today</span>
                        </NavLink>
                    </>
                )}
            </nav>
        </aside>
    );
}
