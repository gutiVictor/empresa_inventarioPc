import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MdLogout, MdPerson, MdNotifications } from 'react-icons/md';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Bienvenido, {user?.full_name}
                    </h2>
                    <p className="text-sm text-gray-600">{user?.department} · {user?.job_title}</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
                        <MdNotifications size={24} />
                    </button>

                    {/* User menu */}
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                            <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
                        </div>

                        <div className="flex items-center justify-center w-10 h-10 bg-primary-100 text-primary-700 rounded-full font-semibold">
                            {user?.full_name?.charAt(0)}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Cerrar sesión"
                        >
                            <MdLogout size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
