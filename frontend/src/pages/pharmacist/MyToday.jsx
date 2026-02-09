import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function MyToday() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        fetchMyPlan();
    }, []);

    const fetchMyPlan = async () => {
        try {
            const response = await api.get('/plans/my-today');
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch plan:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (itemId, status) => {
        setUpdating(itemId);
        try {
            await api.patch(`/plan-items/${itemId}`, { status });
            setData({
                ...data,
                pharmacies: data.pharmacies.map(p =>
                    p.item_id === itemId ? { ...p, status } : p
                ),
            });
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">🗓️ My Plan Today</h1>
                <p className="text-gray-500">{today}</p>
            </div>

            {data?.pharmacist && (
                <div className="card mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl">
                            {data.pharmacist.full_name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg">{data.pharmacist.full_name}</h2>
                            <p className="text-gray-500">Pharmacist</p>
                        </div>
                    </div>
                </div>
            )}

            {data?.pharmacies?.length > 0 ? (
                <div className="space-y-4">
                    {data.pharmacies.map((item) => (
                        <div key={item.item_id} className="card">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-500">
                                    #{item.slot_index}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{item.pharmacy.name}</h3>
                                    <p className="text-gray-600">{item.pharmacy.area}</p>
                                    {item.pharmacy.address && (
                                        <p className="text-sm text-gray-500 mt-1">📍 {item.pharmacy.address}</p>
                                    )}
                                    {item.pharmacy.open_from && item.pharmacy.open_to && (
                                        <p className="text-sm text-gray-500">
                                            🕐 {item.pharmacy.open_from} - {item.pharmacy.open_to}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {item.status === 'Planned' ? (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(item.item_id, 'Done')}
                                                disabled={updating === item.item_id}
                                                className="btn btn-success"
                                            >
                                                {updating === item.item_id ? '...' : '✓ Done'}
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(item.item_id, 'Skipped')}
                                                disabled={updating === item.item_id}
                                                className="btn btn-danger"
                                            >
                                                {updating === item.item_id ? '...' : '✗ Skip'}
                                            </button>
                                        </>
                                    ) : (
                                        <span className={`px-4 py-2 rounded-lg font-medium ${item.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {item.status === 'Done' ? '✓ Completed' : '✗ Skipped'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="card bg-gray-50 text-center">
                        <p className="text-gray-600">
                            <span className="font-semibold">{data.pharmacies.length}</span> pharmacies to visit today
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Completed: {data.pharmacies.filter(p => p.status === 'Done').length} |
                            Skipped: {data.pharmacies.filter(p => p.status === 'Skipped').length} |
                            Remaining: {data.pharmacies.filter(p => p.status === 'Planned').length}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card text-center py-12">
                    <p className="text-5xl mb-4">📭</p>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Plan for Today</h3>
                    <p className="text-gray-500">
                        {data?.message || 'No pharmacies have been assigned to you for today.'}
                    </p>
                </div>
            )}
        </div>
    );
}
