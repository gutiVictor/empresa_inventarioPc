import { useState, useEffect } from 'react';
import { locationService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export default function Locations() {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', code: '', address: '', description: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await locationService.getAll();
            setLocations(res.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            editing ? await locationService.update(editing.id, formData) : await locationService.create(formData);
            setIsModalOpen(false); setEditing(null); setFormData({ name: '', code: '', address: '', description: '' }); loadData();
        } catch (e) { console.error(e); alert('Error al guardar'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar esta ubicación?')) {
            try { await locationService.delete(id); loadData(); } catch (e) { console.error(e); }
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({ name: item.name || '', code: item.code || '', address: item.address || '', description: item.description || '' });
        setIsModalOpen(true);
    };

    const filtered = locations.filter(l => l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || l.code?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-gray-900">Ubicaciones</h1><p className="text-gray-600 mt-1">Gestión de ubicaciones</p></div>
                <Button onClick={() => { setEditing(null); setFormData({ name: '', code: '', address: '', description: '' }); setIsModalOpen(true); }}><MdAdd className="inline mr-2" />Nueva Ubicación</Button>
            </div>
            <Card>
                <div className="mb-4 relative"><MdSearch className="absolute left-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th></tr></thead>
                        <tbody className="divide-y">{filtered.map((item) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{item.code}</td><td className="px-4 py-3 text-sm">{item.name}</td><td className="px-4 py-3 text-sm text-gray-600">{item.address}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEdit(item)} className="text-primary-600 hover:text-primary-800"><MdEdit size={18} /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><MdDelete size={18} /></button></div></td></tr>))}</tbody>
                    </table>
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Editar Ubicación' : 'Nueva Ubicación'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Nombre *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                    <div><label className="block text-sm font-medium mb-1">Código *</label><input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                    <div><label className="block text-sm font-medium mb-1">Dirección</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                    <div><label className="block text-sm font-medium mb-1">Descripción</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" rows="2" /></div>
                    <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">{editing ? 'Actualizar' : 'Crear'}</Button></div>
                </form>
            </Modal>
        </div>
    );
}
