import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';

export default function Pharmacies() {
    const [pharmacies, setPharmacies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPharmacy, setEditingPharmacy] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        area: '',
        address: '',
        open_from: '',
        open_to: '',
        active: true,
    });

    useEffect(() => {
        fetchPharmacies();
    }, []);

    const fetchPharmacies = async () => {
        try {
            const response = await api.get('/pharmacies');
            setPharmacies(response.data);
        } catch (error) {
            console.error('Failed to fetch pharmacies:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (pharmacy = null) => {
        if (pharmacy) {
            setEditingPharmacy(pharmacy);
            setFormData({
                name: pharmacy.name,
                area: pharmacy.area,
                address: pharmacy.address || '',
                open_from: pharmacy.open_from || '',
                open_to: pharmacy.open_to || '',
                active: pharmacy.active,
            });
        } else {
            setEditingPharmacy(null);
            setFormData({ name: '', area: '', address: '', open_from: '', open_to: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPharmacy) {
                await api.put(`/pharmacies/${editingPharmacy.id}`, formData);
            } else {
                await api.post('/pharmacies', formData);
            }
            setIsModalOpen(false);
            fetchPharmacies();
        } catch (error) {
            console.error('Failed to save pharmacy:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this pharmacy?')) return;
        try {
            await api.delete(`/pharmacies/${id}`);
            fetchPharmacies();
        } catch (error) {
            console.error('Failed to delete pharmacy:', error);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🏥 Pharmacies</h1>
                    <p className="text-gray-500">Manage pharmacy locations</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    + Add Pharmacy
                </button>
            </div>

            <div className="card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Area</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Address</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Hours</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pharmacies.map((p) => (
                            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{p.name}</td>
                                <td className="py-3 px-4 text-gray-600">{p.area}</td>
                                <td className="py-3 px-4 text-gray-600">{p.address || '-'}</td>
                                <td className="py-3 px-4 text-gray-600">
                                    {p.open_from && p.open_to ? `${p.open_from} - ${p.open_to}` : '-'}
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {p.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <button onClick={() => openModal(p)} className="text-primary-600 hover:underline mr-3">Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {pharmacies.length === 0 && (
                    <p className="text-center py-8 text-gray-500">No pharmacies found. Add one to get started.</p>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPharmacy ? 'Edit Pharmacy' : 'Add Pharmacy'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Name *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="label">Area *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.area}
                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="label">Address</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Open From</label>
                            <input
                                type="time"
                                className="input"
                                value={formData.open_from}
                                onChange={(e) => setFormData({ ...formData, open_from: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Open To</label>
                            <input
                                type="time"
                                className="input"
                                value={formData.open_to}
                                onChange={(e) => setFormData({ ...formData, open_to: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-4 h-4"
                        />
                        <label htmlFor="active" className="text-gray-700">Active</label>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary flex-1">Cancel</button>
                        <button type="submit" className="btn btn-primary flex-1">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
