import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const users = [];

app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = { email, password };
    users.push(newUser);
    res.json({ user: newUser });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ user });
});

const quizData = [
    {
        question: "What is the capital of France?",
        options: [
            { id: 0, text: "Paris", isCorrect: true },
            { id: 1, text: "Rome", isCorrect: false },
            { id: 2, text: "Madrid", isCorrect: false },
            { id: 3, text: "Berlin", isCorrect: false },
        ]
    },
    // ... more questions
];

app.get('/quiz-data', (req, res) => {
    res.json(quizData);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
