import { useState, useEffect } from 'react';
import { moveService, assetService, locationService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MdAdd, MdSearch } from 'react-icons/md';

export default function Moves() {
    const [moves, setMoves] = useState([]);
    const [assets, setAssets] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ asset_id: '', from_location_id: '', to_location_id: '', reason: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [movRes, assetRes, locRes] = await Promise.all([moveService.getAll(), assetService.getAll(), locationService.getAll()]);
            setMoves(movRes.data);
            setAssets(assetRes.data);
            setLocations(locRes.data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await moveService.create(formData);
            setIsModalOpen(false); setFormData({ asset_id: '', from_location_id: '', to_location_id: '', reason: '' }); loadData();
        } catch (e) { console.error(e); alert('Error al registrar movimiento'); }
    };

    const filtered = moves.filter(m => m.asset?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-gray-900">Movimientos</h1><p className="text-gray-600 mt-1">Historial de movimientos de activos</p></div>
                <Button onClick={() => { setFormData({ asset_id: '', from_location_id: '', to_location_id: '', reason: '' }); setIsModalOpen(true); }}><MdAdd className="inline mr-2" />Nuevo Movimiento</Button>
            </div>
            <Card>
                <div className="mb-4 relative"><MdSearch className="absolute left-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Desde</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hacia</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Razón</th></tr></thead>
                        <tbody className="divide-y">{filtered.map((item) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{item.asset?.name}</td><td className="px-4 py-3 text-sm text-gray-600">{item.fromLocation?.name}</td><td className="px-4 py-3 text-sm text-gray-600">{item.toLocation?.name}</td><td className="px-4 py-3 text-sm text-gray-600">{new Date(item.moved_at || item.created_at).toLocaleDateString()}</td><td className="px-4 py-3 text-sm">{item.reason}</td></tr>))}</tbody>
                    </table>
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Movimiento">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="block text-sm font-medium mb-1">Activo *</label><select required value={formData.asset_id} onChange={(e) => { const asset = assets.find(a => a.id == e.target.value); setFormData({ ...formData, asset_id: e.target.value, from_location_id: asset?.location_id || '' }); }} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="">Seleccionar...</option>{assets.map(a => <option key={a.id} value={a.id}>{a.name} - {a.asset_tag}</option>)}</select></div>
                    <div><label className="block text-sm font-medium mb-1">Desde *</label><select required value={formData.from_location_id} onChange={(e) => setFormData({ ...formData, from_location_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="">Seleccionar...</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium mb-1">Hacia *</label><select required value={formData.to_location_id} onChange={(e) => setFormData({ ...formData, to_location_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"><option value="">Seleccionar...</option>{locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                    <div><label className="block text-sm font-medium mb-1">Razón</label><textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" rows="2" /></div>
                    <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button type="submit">Registrar</Button></div>
                </form>
            </Modal>
        </div>
    );
}
