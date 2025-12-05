import { useState, useEffect } from 'react';
import { maintenanceService, assetService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export default function Maintenance() {
    const [orders, setOrders] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ asset_id: '', type: 'preventive', status: 'scheduled', scheduled_date: '', description: '', cost: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [ordersRes, assetsRes] = await Promise.all([maintenanceService.getAll(), assetService.getAll()]);
            setOrders(ordersRes.data);
            setAssets(assetsRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            editing ? await maintenanceService.update(editing.id, formData) : await maintenanceService.create(formData);
            setIsModalOpen(false); setEditing(null); resetForm(); loadData();
        } catch (e) { console.error(e); alert('Error al guardar'); }
    };

    const resetForm = () => setFormData({ asset_id: '', type: 'preventive', status: 'scheduled', scheduled_date: '', description: '', cost: '' });

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar esta orden?')) {
            try { await maintenanceService.delete(id); loadData(); } catch (e) { console.error(e); }
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({ asset_id: item.asset_id || '', type: item.type || 'preventive', status: item.status || 'scheduled', scheduled_date: item.scheduled_date?.split('T')[0] || '', description: item.description || '', cost: item.cost || '' });
        setIsModalOpen(true);
    };

    const filtered = orders.filter(o => o.asset?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || o.type?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-gray-900">Mantenimiento</h1><p className="text-gray-600 mt-1">Órdenes de mantenimiento</p></div>
                <Button onClick={() => { setEditing(null); resetForm(); setIsModalOpen(true); }}><MdAdd className="inline mr-2" />Nueva Orden</Button>
            </div>
            <Card>
                <div className="mb-4 relative"><MdSearch className="absolute left-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Programada</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th></tr></thead>
                        <tbody className="divide-y">{filtered.map((item) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{item.asset?.name}</td><td className="px-4 py-3 text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.type === 'preventive' ? 'bg-blue-100 text-blue-800' : item.type === 'corrective' ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}`}>{item.type}</span></td><td className="px-4 py-3 text-sm text-gray-600">{item.scheduled_date && new Date(item.scheduled_date).toLocaleDateString()}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-800' : item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{item.status}</span></td><td className="px-4 py-3 text-sm">${item.cost || 0}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEdit(item)} className="text-primary-600 hover:text-primary-800"><MdEdit size={18} /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><MdDelete size={18} /></button></div></td></tr>))}</tbody>
                    </table>
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Editar Orden' : 'Nueva Orden'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium mb-1">Activo *</label><select required value={formData.asset_id} onChange={(e) => setFormData({ ...formData, asset_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="">Seleccionar...</option>{assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium mb-1">Tipo</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="preventive">Preventivo</option><option value="corrective">Correctivo</option><option value="upgrade">Upgrade</option></select></div>
                        <div><label className="block text-sm font-medium mb-1">Estado</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="scheduled">Programado</option><option value="in_progress">En Progreso</option><option value="completed">Completado</option><option value="cancelled">Cancelado</option></select></div>
                        <div><label className="block text-sm font-medium mb-1">Fecha Programada</label><input type="date" value={formData.scheduled_date} onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Costo</label><input type="number" step="0.01" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Descripción</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" rows="2" /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">{editing ? 'Actualizar' : 'Crear'}</Button></div>
                </form>
            </Modal>
        </div>
    );
}
