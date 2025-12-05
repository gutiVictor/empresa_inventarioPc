import { useState, useEffect } from 'react';
import { supplierService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', contact_person: '', email: '', phone: '', address: '', tax_id: '', notes: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try { const res = await supplierService.getAll(); setSuppliers(res.data); } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            editing ? await supplierService.update(editing.id, formData) : await supplierService.create(formData);
            setIsModalOpen(false); setEditing(null); setFormData({ name: '', contact_person: '', email: '', phone: '', address: '', tax_id: '', notes: '' }); loadData();
        } catch (e) { console.error(e); alert('Error al guardar'); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este proveedor?')) {
            try { await supplierService.delete(id); loadData(); } catch (e) { console.error(e); }
        }
    };

    const openEdit = (item) => {
        setEditing(item);
        setFormData({ name: item.name || '', contact_person: item.contact_person || '', email: item.email || '', phone: item.phone || '', address: item.address || '', tax_id: item.tax_id || '', notes: item.notes || '' });
        setIsModalOpen(true);
    };

    const filtered = suppliers.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-gray-900">Proveedores</h1><p className="text-gray-600 mt-1">Gestión de proveedores</p></div>
                <Button onClick={() => { setEditing(null); setFormData({ name: '', contact_person: '', email: '', phone: '', address: '', tax_id: '', notes: '' }); setIsModalOpen(true); }}><MdAdd className="inline mr-2" />Nuevo Proveedor</Button>
            </div>
            <Card>
                <div className="mb-4 relative"><MdSearch className="absolute left-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th></tr></thead>
                        <tbody className="divide-y">{filtered.map((item) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{item.name}</td><td className="px-4 py-3 text-sm">{item.contact_person}</td><td className="px-4 py-3 text-sm text-gray-600">{item.email}</td><td className="px-4 py-3 text-sm">{item.phone}</td><td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openEdit(item)} className="text-primary-600 hover:text-primary-800"><MdEdit size={18} /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><MdDelete size={18} /></button></div></td></tr>))}</tbody>
                    </table>
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? 'Editar Proveedor' : 'Nuevo Proveedor'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Nombre *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Persona de Contacto</label><input type="text" value={formData.contact_person} onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">Teléfono</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div><label className="block text-sm font-medium mb-1">RUC/NIT</label><input type="text" value={formData.tax_id} onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Dirección</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                        <div className="col-span-2"><label className="block text-sm font-medium mb-1">Notas</label><textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" rows="2" /></div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">{editing ? 'Actualizar' : 'Crear'}</Button></div>
                </form>
            </Modal>
        </div>
    );
}
