import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import Card from '../../components/common/Card';
import { MdInventory, MdAssignment, MdBuild, MdAttachMoney } from 'react-icons/md';

const COLORS = ['#2563eb', '#16a34a', '#eab308', '#dc2626', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalAssets: 0,
        assignedAssets: 0,
        pendingMaintenance: 0,
        totalValue: 0,
    });
    const [assetsByCategory, setAssetsByCategory] = useState([]);
    const [assetsByLocation, setAssetsByLocation] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [assets, assignments, maintenance] = await Promise.all([
                api.get('/assets'),
                api.get('/assignments'),
                api.get('/maintenance'),
            ]);

            // Calcular estadísticas
            setStats({
                totalAssets: assets.data.length,
                assignedAssets: assignments.data.filter(a => a.status === 'active').length,
                pendingMaintenance: maintenance.data.filter(m => m.status === 'scheduled').length,
                totalValue: assets.data.reduce((sum, a) => sum + (parseFloat(a.purchase_cost) || 0), 0),
            });

            // Agrupar activos por categoría
            const categoryMap = {};
            assets.data.forEach(asset => {
                const category = asset.category?.name || 'Sin categoría';
                categoryMap[category] = (categoryMap[category] || 0) + 1;
            });
            setAssetsByCategory(
                Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
            );

            // Agrupar activos por ubicación
            const locationMap = {};
            assets.data.forEach(asset => {
                const location = asset.location?.name || 'Sin ubicación';
                locationMap[location] = (locationMap[location] || 0) + 1;
            });
            setAssetsByLocation(
                Object.entries(locationMap).map(([name, value]) => ({ name, value }))
            );

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Resumen general del inventario</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Activos</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalAssets}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MdInventory className="text-blue-600" size={24} />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Asignados</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.assignedAssets}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <MdAssignment className="text-green-600" size={24} />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Mantenimiento Pendiente</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingMaintenance}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <MdBuild className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Valor Total</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                ${stats.totalValue.toLocaleString()}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <MdAttachMoney className="text-purple-600" size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Activos por Categoría">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={assetsByCategory}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {assetsByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Activos por Ubicación">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={assetsByLocation}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#2563eb" name="Activos" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}
