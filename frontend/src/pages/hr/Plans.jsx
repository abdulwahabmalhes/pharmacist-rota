import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function Plans() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [plan, setPlan] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPlan();
    }, [date]);

    const fetchPlan = async () => {
        setLoading(true);
        try {
            const response = await api.get('/plans', { params: { date } });
            setPlan(response.data.plan);
            setAssignments(response.data.assignments || []);
        } catch (error) {
            console.error('Failed to fetch plan:', error);
            setPlan(null);
            setAssignments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setMessage('');
        try {
            const response = await api.post('/plans/generate', null, { params: { date } });
            setPlan(response.data.plan);
            setAssignments(response.data.assignments || []);
            setMessage('Plan generated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to generate plan');
        } finally {
            setGenerating(false);
        }
    };

    const handleExport = async (format) => {
        try {
            if (format === 'csv') {
                const response = await api.get('/plans/export', {
                    params: { date, format: 'csv' },
                    responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `plan-${date}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                const response = await api.get('/plans/export', { params: { date, format: 'json' } });
                const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `plan-${date}.json`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">📋 Daily Plans</h1>
                    <p className="text-gray-500">Generate Random Plan (Demo)</p>
                </div>
            </div>

            <div className="card mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                    <div>
                        <label className="label">Select Date</label>
                        <input
                            type="date"
                            className="input w-auto"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="btn btn-primary"
                    >
                        {generating ? 'Generating...' : '🎲 Generate Random Plan'}
                    </button>
                    {plan && (
                        <>
                            <button onClick={() => handleExport('csv')} className="btn btn-secondary">
                                📥 Export CSV
                            </button>
                            <button onClick={() => handleExport('json')} className="btn btn-secondary">
                                📥 Export JSON
                            </button>
                        </>
                    )}
                    {message && (
                        <div className={`px-4 py-2 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading...</div>
            ) : plan ? (
                <div>
                    <div className="card mb-6">
                        <div className="flex items-center gap-6 text-sm">
                            <div>
                                <span className="text-gray-500">Date:</span>{' '}
                                <span className="font-medium">{plan.date}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Algorithm:</span>{' '}
                                <span className="font-medium">{plan.algorithm}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Generated by:</span>{' '}
                                <span className="font-medium">{plan.generated_by}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {assignments.map((assignment, index) => (
                            <div key={index} className="card">
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                                        {assignment.pharmacist.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{assignment.pharmacist.full_name}</h3>
                                        <p className="text-sm text-gray-500">{assignment.pharmacist.home_area}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {assignment.pharmacies.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                            <span className="text-xs font-bold text-gray-400 w-6">#{item.slot_index}</span>
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{item.pharmacy.name}</p>
                                                <p className="text-xs text-gray-500">{item.pharmacy.area}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${item.status === 'Done' ? 'bg-green-100 text-green-700' :
                                                    item.status === 'Skipped' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-3 text-center">
                                    {assignment.pharmacies.length} pharmacies assigned
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="card text-center py-12">
                    <p className="text-gray-500 mb-4">No plan exists for this date.</p>
                    <button onClick={handleGenerate} className="btn btn-primary">
                        🎲 Generate Plan Now
                    </button>
                </div>
            )}
        </div>
    );
}
