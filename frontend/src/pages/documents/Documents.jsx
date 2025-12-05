import { useState, useEffect } from 'react';
import { documentService, assetService } from '../../services';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { MdSearch, MdDelete, MdDownload } from 'react-icons/md';

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try { const res = await documentService.getAll(); setDocuments(res.data); } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este documento?')) {
            try { await documentService.delete(id); loadData(); } catch (e) { console.error(e); }
        }
    };

    const filtered = documents.filter(d => d.name?.toLowerCase().includes(searchTerm.toLowerCase()) || d.document_type?.toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-2 border-primary-600 rounded-full"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div><h1 className="text-3xl font-bold text-gray-900">Documentos</h1><p className="text-gray-600 mt-1">Gestión de documentos</p></div>
            </div>
            <Card>
                <div className="mb-4 relative"><MdSearch className="absolute left-3 top-3 text-gray-400" size={20} /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500" /></div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entidad</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th></tr></thead>
                        <tbody className="divide-y">{filtered.map((item) => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium">{item.name}</td><td className="px-4 py-3 text-sm"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{item.document_type}</span></td><td className="px-4 py-3 text-sm text-gray-600">{item.entity_type} #{item.entity_id}</td><td className="px-4 py-3 text-sm text-gray-600">{new Date(item.created_at).toLocaleDateString()}</td><td className="px-4 py-3"><div className="flex gap-2">{item.file_path && <a href={item.file_path} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800"><MdDownload size={18} /></a>}<button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><MdDelete size={18} /></button></div></td></tr>))}</tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
