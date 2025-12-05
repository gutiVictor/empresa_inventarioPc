import { useState, useEffect } from 'react';
import { licenseService, supplierService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export default function Licenses() {
    const [licenses, setLicenses] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', key: '', type: 'perpetual', seats_total: '', seats_used: 0, expiration_date: '', cost: '', supplier_id: '', notes: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [licRes, supRes] = await Promise.all([licenseService.getAll(), supplierService.getAll()]);
            setLicenses(licRes.data);
            setSuppliers(supRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            editing ? await licenseService.update(editing.id, formData) : await licenseService.create(formData);
            setIsModalOpen(false); setEditing(null); resetForm(); loadData();
        } catch (e) { console.error(e); alert('Error al guardar'); }
    };

    const resetForm = () => setFormData({ name: '', key: '', type: 'perpetual', seats_total: '', seats_used: 0, expiration_date: '', cost: '', supplier_id: '', notes: '' });

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar esta licencia?')) {
            try { await licenseService.delete(id); loadData(); } catch (e) { console.error(e); }
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({ name: item.name || '', key: item.key || '', type: item.type || 'perpetual', seats_total: item.seats_total || '', seats_used: item.seats_used || 0, expiration_date: item.expiration_date?.split('T')[0] || '', cost: item.cost || '', supplier_id: item.supplier_id || '', notes: item.notes || '' });
        setIsModalOpen(true);
    };

    const filtered = licenses.filter(l => l.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-gray-900">Licencias</h1><p className="text-gray-600 mt-1">Gestión de licencias de software</p></div>
                <Button onClick={() => { setEditing(null); resetForm(); setIsModalOpen(true); }}><MdAdd className="inline mr-2" />Nueva Licencia</Button>
            </div>
            <Card>
                <div className="mb-4 relative"><MdSearch className="absolute left-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puestos</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiración</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Costo</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th></tr></thead>
                        <tbody className="divide-y">{filtered.map((item) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{item.name}</td><td className="px-4 py-3 text-sm"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.type === 'perpetual' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{item.type}</span></td><td className="px-4 py-3 text-sm">{item.seats_used}/{item.seats_total}</td><td className="px-4 py-3 text-sm text-gray-600">{item.expiration_date && new Date(item.expiration_date).toLocaleDateString()}</td><td className="px-4 py-3 text-sm">${item.cost || 0}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEdit(item)} className="text-primary-600 hover:text-primary-800"><MdEdit size={18} /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><MdDelete size={18} /></button></div></td></tr>))}</tbody>
                    </table>
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Editar Licencia' : 'Nueva Licencia'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Nombre *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Clave de Licencia</label><input type="text" value={formData.key} onChange={(e) => setFormData({ ...formData, key: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono" /></div>
                        <div><label className="block text-sm font-medium mb-1">Tipo</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="perpetual">Perpetua</option><option value="subscription">Suscripción</option></select></div>
                        <div><label className="block text-sm font-medium mb-1">Total de Puestos</label><input type="number" value={formData.seats_total} onChange={(e) => setFormData({ ...formData, seats_total: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Fecha Expiración</label><input type="date" value={formData.expiration_date} onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Costo</label><input type="number" step="0.01" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Proveedor</label><select value={formData.supplier_id} onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="">Seleccionar...</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Notas</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" rows="2" /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">{editing ? 'Actualizar' : 'Crear'}</Button></div>
                </form>
            </Modal>
        </div>
    );
}
