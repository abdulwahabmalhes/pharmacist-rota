import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';

export default function Pharmacists() {
    const [pharmacists, setPharmacists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPharmacist, setEditingPharmacist] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        home_area: '',
        active: true,
    });

    useEffect(() => {
        fetchPharmacists();
    }, []);

    const fetchPharmacists = async () => {
        try {
            const response = await api.get('/pharmacists');
            setPharmacists(response.data);
        } catch (error) {
            console.error('Failed to fetch pharmacists:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (pharmacist = null) => {
        if (pharmacist) {
            setEditingPharmacist(pharmacist);
            setFormData({
                full_name: pharmacist.full_name,
                phone: pharmacist.phone || '',
                home_area: pharmacist.home_area,
                active: pharmacist.active,
            });
        } else {
            setEditingPharmacist(null);
            setFormData({ full_name: '', phone: '', home_area: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPharmacist) {
                await api.put(`/pharmacists/${editingPharmacist.id}`, formData);
            } else {
                await api.post('/pharmacists', formData);
            }
            setIsModalOpen(false);
            fetchPharmacists();
        } catch (error) {
            console.error('Failed to save pharmacist:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this pharmacist?')) return;
        try {
            await api.delete(`/pharmacists/${id}`);
            fetchPharmacists();
        } catch (error) {
            console.error('Failed to delete pharmacist:', error);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">👨‍⚕️ Pharmacists</h1>
                    <p className="text-gray-500">Manage pharmacist records</p>
                </div>
                <button onClick={() => openModal()} className="btn btn-primary">
                    + Add Pharmacist
                </button>
            </div>

            <div className="card">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Phone</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Home Area</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pharmacists.map((p) => (
                            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{p.full_name}</td>
                                <td className="py-3 px-4 text-gray-600">{p.phone || '-'}</td>
                                <td className="py-3 px-4 text-gray-600">{p.home_area}</td>
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

                {pharmacists.length === 0 && (
                    <p className="text-center py-8 text-gray-500">No pharmacists found. Add one to get started.</p>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPharmacist ? 'Edit Pharmacist' : 'Add Pharmacist'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Full Name *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="label">Phone</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="label">Home Area *</label>
                        <input
                            type="text"
                            className="input"
                            value={formData.home_area}
                            onChange={(e) => setFormData({ ...formData, home_area: e.target.value })}
                            required
                        />
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
