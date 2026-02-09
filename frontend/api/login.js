// Mock Users Database
const users = [
    { id: 1, name: 'HR Admin', email: 'hr@demo.com', password: 'Password123!', role: 'HR' },
    { id: 2, name: 'Manager User', email: 'manager@demo.com', password: 'Password123!', role: 'Manager' },
    { id: 3, name: 'Ahmed Pharmacist', email: 'pharm@demo.com', password: 'Password123!', role: 'Pharmacist' },
];

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            return res.status(200).json({
                token: 'mock-token-' + user.id,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            return res.status(401).json({ message: 'The provided credentials are incorrect.' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
