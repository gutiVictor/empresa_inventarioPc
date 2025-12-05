import { useState, useEffect } from 'react';
import { assetService, categoryService, locationService, supplierService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';

export default function Assets() {
    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        model: '',
        serial_number: '',
        asset_tag: '',
        category_id: '',
        location_id: '',
        supplier_id: '',
        status: 'active',
        condition: 'excellent',
        purchase_date: '',
        purchase_cost: '',
        warranty_expiration: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [assetsRes, categoriesRes, locationsRes, suppliersRes] = await Promise.all([
                assetService.getAll(),
                categoryService.getAll(),
                locationService.getAll(),
                supplierService.getAll(),
            ]);
            setAssets(assetsRes.data);
            setCategories(categoriesRes.data);
            setLocations(locationsRes.data);
            setSuppliers(suppliersRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAsset) {
                await assetService.update(editingAsset.id, formData);
            } else {
                await assetService.create(formData);
            }
            setIsModalOpen(false);
            setEditingAsset(null);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Error saving asset:', error);
            alert('Error al guardar el activo');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este activo?')) {
            try {
                await assetService.delete(id);
                loadData();
            } catch (error) {
                console.error('Error deleting asset:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            brand: '',
            model: '',
            serial_number: '',
            asset_tag: '',
            category_id: '',
            location_id: '',
            supplier_id: '',
            status: 'active',
            condition: 'excellent',
            purchase_date: '',
            purchase_cost: '',
            warranty_expiration: '',
        });
    };

    const openEditModal = (asset) => {
        setEditingAsset(asset);
        setFormData({
            name: asset.name || '',
            brand: asset.brand || '',
            model: asset.model || '',
            serial_number: asset.serial_number || '',
            asset_tag: asset.asset_tag || '',
            category_id: asset.category_id || '',
            location_id: asset.location_id || '',
            supplier_id: asset.supplier_id || '',
            status: asset.status || 'active',
            condition: asset.condition || 'excellent',
            purchase_date: asset.purchase_date?.split('T')[0] || '',
            purchase_cost: asset.purchase_cost || '',
            warranty_expiration: asset.warranty_expiration?.split('T')[0] || '',
        });
        setIsModalOpen(true);
    };

    const filteredAssets = assets.filter(asset =>
        asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.asset_tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Activos</h1>
                    <p className="text-gray-600 mt-1">Gestión de activos del inventario</p>
                </div>
                <Button onClick={() => { resetForm(); setEditingAsset(null); setIsModalOpen(true); }}>
                    <MdAdd className="inline mr-2" />
                    Nuevo Activo
                </Button>
            </div>

            <Card>
                <div className="mb-4">
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar activos..."
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
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Etiqueta</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca/Modelo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{asset.asset_tag}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{asset.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{asset.brand} {asset.model}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{asset.category?.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{asset.location?.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${asset.status === 'active' ? 'bg-green-100 text-green-800' :
                                            asset.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(asset)} className="text-primary-600 hover:text-primary-800">
                                                <MdEdit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(asset.id)} className="text-red-600 hover:text-red-800">
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

            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingAsset(null); }}
                title={editingAsset ? 'Editar Activo' : 'Nuevo Activo'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta *</label>
                            <input
                                type="text"
                                required
                                value={formData.asset_tag}
                                onChange={(e) => setFormData({ ...formData, asset_tag: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                            <input
                                type="text"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Número de Serie</label>
                            <input
                                type="text"
                                value={formData.serial_number}
                                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                            <select
                                required
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                            <select
                                required
                                value={formData.location_id}
                                onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Seleccionar...</option>
                                {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                            <select
                                value={formData.supplier_id}
                                onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Seleccionar...</option>
                                {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="maintenance">Mantenimiento</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condición</label>
                            <select
                                value={formData.condition}
                                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="excellent">Excelente</option>
                                <option value="good">Bueno</option>
                                <option value="fair">Regular</option>
                                <option value="poor">Malo</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Compra</label>
                            <input
                                type="date"
                                value={formData.purchase_date}
                                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Costo de Compra</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.purchase_cost}
                                onChange={(e) => setFormData({ ...formData, purchase_cost: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => { setIsModalOpen(false); setEditingAsset(null); }}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingAsset ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
