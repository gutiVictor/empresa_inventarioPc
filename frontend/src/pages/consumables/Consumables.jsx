import { useState, useEffect } from 'react';
import { consumableService, categoryService, locationService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export default function Consumables() {
    const [consumables, setConsumables] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', sku: '', category_id: '', location_id: '', quantity: 0, min_quantity: 0, unit_cost: '', notes: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [conRes, catRes, locRes] = await Promise.all([consumableService.getAll(), categoryService.getAll(), locationService.getAll()]);
            setConsumables(conRes.data);
            setCategories(catRes.data);
            setLocations(locRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            editing ? await consumableService.update(editing.id, formData) : await consumableService.create(formData);
            setIsModalOpen(false); setEditing(null); resetForm(); loadData();
        } catch (e) { console.error(e); alert('Error al guardar'); }
    };

    const resetForm = () => setFormData({ name: '', sku: '', category_id: '', location_id: '', quantity: 0, min_quantity: 0, unit_cost: '', notes: '' });

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este consumible?')) {
            try { await consumableService.delete(id); loadData(); } catch (e) { console.error(e); }
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({ name: item.name || '', sku: item.sku || '', category_id: item.category_id || '', location_id: item.location_id || '', quantity: item.quantity || 0, min_quantity: item.min_quantity || 0, unit_cost: item.unit_cost || '', notes: item.notes || '' });
        setIsModalOpen(true);
    };

    const filtered = consumables.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.sku?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-gray-900">Consumibles</h1><p className="text-gray-600 mt-1">Gestión de consumibles e insumos</p></div>
                <Button onClick={() => { setEditing(null); resetForm(); setIsModalOpen(true); }}><MdAdd className="inline mr-2" />Nuevo Consumible</Button>
            </div>
            <Card>
                <div className="mb-4 relative"><MdSearch className="absolute left-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Mínimo</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th></tr></thead>
                        <tbody className="divide-y">{filtered.map((item) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{item.sku}</td><td className="px-4 py-3 text-sm">{item.name}</td><td className="px-4 py-3 text-sm">{item.quantity}</td><td className="px-4 py-3 text-sm">{item.min_quantity}</td><td className="px-4 py-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.quantity <= item.min_quantity ? 'bg-red-100 text-red-800' : item.quantity <= item.min_quantity * 1.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{item.quantity <= item.min_quantity ? 'Bajo' : item.quantity <= item.min_quantity * 1.5 ? 'Advertencia' : 'OK'}</span></td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEdit(item)} className="text-primary-600 hover:text-primary-800"><MdEdit size={18} /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><MdDelete size={18} /></button></div></td></tr>))}</tbody>
                    </table>
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Editar Consumible' : 'Nuevo Consumible'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Nombre *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">SKU</label><input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Categoría</label><select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="">Seleccionar...</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium mb-1">Ubicación</label><select value={formData.location_id} onChange={(e) => setFormData({ ...formData, location_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="">Seleccionar...</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                        <div><label className="block text-sm font-medium mb-1">Cantidad Actual</label><input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Stock Mínimo</label><input type="number" value={formData.min_quantity} onChange={(e) => setFormData({ ...formData, min_quantity: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Costo Unitario</label><input type="number" step="0.01" value={formData.unit_cost} onChange={(e) => setFormData({ ...formData, unit_cost: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Notas</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" rows="2" /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">{editing ? 'Actualizar' : 'Crear'}</Button></div>
                </form>
            </Modal>
        </div>
    );
}
