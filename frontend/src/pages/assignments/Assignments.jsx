import { useState, useEffect } from 'react';
import { assignmentService, assetService, userService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MdAdd, MdSearch, MdCheck, MdClose } from 'react-icons/md';

export default function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [assets, setAssets] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ asset_id: '', user_id: '', notes: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [assRes, assetRes, userRes] = await Promise.all([assignmentService.getAll(), assetService.getAll(), userService.getAll()]);
            setAssignments(assRes.data);
            setAssets(assetRes.data);
            setUsers(userRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await assignmentService.create(formData);
            setIsModalOpen(false); setFormData({ asset_id: '', user_id: '', notes: '' }); loadData();
        } catch (e) { console.error(e); alert('Error al crear asignación'); }
    };

    const handleReturn = async (id) => {
        if (window.confirm('¿Registrar devolución de este activo?')) {
            try { await assignmentService.returnAsset(id, 'Devuelto'); loadData(); } catch (e) { console.error(e); }
        }
    };

    const filtered = assignments.filter(a =>
        a.asset?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-gray-900">Asignaciones</h1><p className="text-gray-600 mt-1">Gestión de asignaciones de activos</p></div>
                <Button onClick={() => { setFormData({ asset_id: '', user_id: '', notes: '' }); setIsModalOpen(true); }}><MdAdd className="inline mr-2" />Nueva Asignación</Button>
            </div>
            <Card>
                <div className="mb-4 relative"><MdSearch className="absolute left-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Asignación</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th></tr></thead>
                        <tbody className="divide-y">{filtered.map((item) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{item.asset?.name}</td><td className="px-4 py-3 text-sm">{item.user?.full_name}</td><td className="px-4 py-3 text-sm text-gray-600">{new Date(item.assigned_at).toLocaleDateString()}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{item.status}</span></td><td className="px-4 py-3">{item.status === 'active' && <button onClick={() => handleReturn(item.id)} className="text-yellow-600 hover:text-yellow-800" title="Registrar Devolución"><MdCheck size={18} /></button>}</td></tr>))}</tbody>
                    </table>
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Asignación">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Activo *</label><select required value={formData.asset_id} onChange={(e) => setFormData({ ...formData, asset_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="">Seleccionar...</option>{assets.map(a => <option key={a.id} value={a.id}>{a.name} - {a.asset_tag}</option>)}</select></div>
                    <div><label className="block text-sm font-medium mb-1">Usuario *</label><select required value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="">Seleccionar...</option>{users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium mb-1">Notas</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" rows="2" /></div>
                    <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">Asignar</Button></div>
                </form>
            </Modal>
        </div>
    );
}
