import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const users = []; // Temporary in-memory storage

// Signup route
app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { email, password };
    users.push(newUser);
    console.log('Signup successful:', newUser);
    res.status(201).json({ user: newUser });
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful:', user);
    res.status(200).json({ user });
});

// Quiz data
const quizData = [
    {
        question: "What is the capital of France?",
        options: [
            { id: 0, text: "Paris", isCorrect: true },
            { id: 1, text: "Rome", isCorrect: false },
            { id: 2, text: "Madrid", isCorrect: false },
            { id: 3, text: "Berlin", isCorrect: false }
        ]
    },
    // Add more questions here
];

app.get('/quiz-data', (req, res) => {
    res.json(quizData);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
