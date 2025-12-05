import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    MdDashboard,
    MdInventory,
    MdPeople,
    MdLocationOn,
    MdCategory,
    MdStore,
    MdAssignment,
    MdBuild,
    MdLaptop,
    MdShoppingCart,
    MdDescription,
    MdSwapHoriz,
    MdMenu,
    MdClose,
} from 'react-icons/md';

const menuItems = [
    { path: '/', icon: MdDashboard, label: 'Dashboard' },
    { path: '/assets', icon: MdInventory, label: 'Activos' },
    { path: '/users', icon: MdPeople, label: 'Usuarios' },
    { path: '/locations', icon: MdLocationOn, label: 'Ubicaciones' },
    { path: '/categories', icon: MdCategory, label: 'Categorías' },
    { path: '/suppliers', icon: MdStore, label: 'Proveedores' },
    { path: '/assignments', icon: MdAssignment, label: 'Asignaciones' },
    { path: '/maintenance', icon: MdBuild, label: 'Mantenimiento' },
    { path: '/licenses', icon: MdLaptop, label: 'Licencias' },
    { path: '/consumables', icon: MdShoppingCart, label: 'Consumibles' },
    { path: '/documents', icon: MdDescription, label: 'Documentos' },
    { path: '/moves', icon: MdSwapHoriz, label: 'Movimientos' },
];

export default function Sidebar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
            >
                {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 p-6 border-b border-gray-200">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                            <MdInventory className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg text-gray-900">Inventario</h1>
                            <p className="text-xs text-gray-500">Sistema IT</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <li key={item.path}>
                                        <Link
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                                    ? 'bg-primary-50 text-primary-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
