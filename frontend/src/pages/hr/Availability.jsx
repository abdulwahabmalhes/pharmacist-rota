import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Availability() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [pharmacists, setPharmacists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchAvailability();
    }, [date]);

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            const response = await api.get('/availability', { params: { date } });
            setPharmacists(response.data);
        } catch (error) {
            console.error('Failed to fetch availability:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (pharmacistId, status) => {
        setPharmacists(pharmacists.map(p =>
            p.id === pharmacistId ? { ...p, status } : p
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await api.post('/availability', {
                date,
                availabilities: pharmacists.map(p => ({
                    pharmacist_id: p.id,
                    status: p.status,
                    note: p.note,
                })),
            });
            setMessage('Availability saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Failed to save availability.');
        } finally {
            setSaving(false);
        }
    };

    const statuses = ['Available', 'Off', 'Sick', 'Leave'];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-700 border-green-300';
            case 'Off': return 'bg-gray-100 text-gray-700 border-gray-300';
            case 'Sick': return 'bg-red-100 text-red-700 border-red-300';
            case 'Leave': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default: return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📅 Daily Availability</h1>
                    <p className="text-gray-500">Who is available today?</p>
                </div>
            </div>

            <div className="card mb-6">
                <div className="flex items-center gap-4">
                    <div>
                        <label className="label">Select Date</label>
                        <input
                            type="date"
                            className="input w-auto"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="flex-1"></div>
                    {message && (
                        <div className={`px-4 py-2 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {pharmacists.map((p) => (
                        <div key={p.id} className="card flex items-center gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{p.full_name}</h3>
                                <p className="text-sm text-gray-500">{p.home_area}</p>
                            </div>
                            <div className="flex gap-2">
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(p.id, status)}
                                        className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${p.status === status
                                                ? getStatusColor(status) + ' ring-2 ring-offset-1'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {pharmacists.length === 0 && (
                        <p className="text-center py-8 text-gray-500">No pharmacists found. Add some first.</p>
                    )}
                </div>
            )}
        </div>
    );
}
