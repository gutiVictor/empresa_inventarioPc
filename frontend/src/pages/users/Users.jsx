import { useState, useEffect } from 'react';
import { userService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        employee_id: '',
        department: '',
        job_title: '',
        role: 'viewer',
        active: true,
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await userService.getAll();
            setUsers(res.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await userService.update(editingUser.id, formData);
            } else {
                await userService.create(formData);
            }
            setIsModalOpen(false);
            setEditingUser(null);
            resetForm();
            loadUsers();
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar usuario');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este usuario?')) {
            try {
                await userService.delete(id);
                loadUsers();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            email: '',
            employee_id: '',
            department: '',
            job_title: '',
            role: 'viewer',
            active: true,
        });
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            full_name: user.full_name || '',
            email: user.email || '',
            employee_id: user.employee_id || '',
            department: user.department || '',
            job_title: user.job_title || '',
            role: user.role || 'viewer',
            active: user.active !== undefined ? user.active : true,
        });
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
                    <p className="text-gray-600 mt-1">Gestión de usuarios del sistema</p>
                </div>
                <Button onClick={() => { resetForm(); setEditingUser(null); setIsModalOpen(true); }}>
                    <MdAdd className="inline mr-2" />Nuevo Usuario
                </Button>
            </div>

            <Card>
                <div className="mb-4">
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.full_name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.department}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{user.job_title}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                    user.role === 'operator' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {user.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(user)} className="text-primary-600 hover:text-primary-800">
                                                <MdEdit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                                                <MdDelete size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isModalOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingUser(null); }} title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                            <input type="text" required value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID Empleado</label>
                            <input type="text" value={formData.employee_id} onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                            <input type="text" required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cargo *</label>
                            <input type="text" required value={formData.job_title} onChange={(e) => setFormData({ ...formData, job_title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                                <option value="viewer">Viewer</option>
                                <option value="operator">Operator</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} className="rounded text-primary-600 focus:ring-primary-500" />
                                <span className="text-sm font-medium text-gray-700">Usuario Activo</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingUser(null); }}>Cancelar</Button>
                        <Button type="submit">{editingUser ? 'Actualizar' : 'Crear'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
