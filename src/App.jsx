import { useState, useEffect } from 'react';
import Quiz from './components/Quiz';
import Welcome from './components/Welcome';
import Results from './components/Results';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [authPage, setAuthPage] = useState('login');
    const [quizData, setQuizData] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [gameStatus, setGameStatus] = useState('welcome');
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answerFeedback, setAnswerFeedback] = useState(null);
    const [timer, setTimer] = useState(30);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://quiz-app-backend-tqxv.onrender.com');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData?.message || 'Failed to load quiz data');
                }
                const data = await response.json();
                setQuizData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const startTimer = () => {
        const id = setInterval(() => {
            setTimer(prev => {
                if (prev === 0) {
                    clearInterval(id);
                    handleAnswerSelect(false, -1); // timeout
                    return 30;
                }
                return prev - 1;
            });
        }, 1000);
        setIntervalId(id);
    };

    const handleStartQuiz = () => {
        setGameStatus('playing');
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswers([]);
        setAnswerFeedback(null);
        setTimer(30);
        startTimer();
    };

    const handleAnswerSelect = (isCorrect, answerId) => {
        if (selectedAnswers.includes(answerId)) return;

        setAnswerFeedback(isCorrect ? 'correct' : 'incorrect');
        if (isCorrect) setScore(prev => prev + 1);
        setSelectedAnswers(prev => [...prev, answerId]);

        clearInterval(intervalId);

        setTimeout(() => {
            setAnswerFeedback(null);
            if (currentQuestion < quizData.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setTimer(30);
                startTimer();
            } else {
                setGameStatus('finished');
            }
        }, 1000);
    };

    const handleRestart = () => {
        clearInterval(intervalId);
        setGameStatus('welcome');
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswers([]);
        setAnswerFeedback(null);
        setTimer(30);
    };

    if (!user) {
        return (
            <div className="container">
                {authPage === 'login' ? (
                    <Login onLogin={setUser} />
                ) : (
                    <Signup onSignup={setUser} />
                )}
                <button onClick={() => setAuthPage(authPage === 'login' ? 'signup' : 'login')}>
                    {authPage === 'login' ? 'Go to Signup' : 'Go to Login'}
                </button>
            </div>
        );
    }

    if (loading) return <div className="container">Loading quiz...</div>;
    if (error) return <div className="container">Error: {error}</div>;

    return (
        <div className="container">
            {gameStatus === 'welcome' && <Welcome onStart={handleStartQuiz} />}
            {gameStatus === 'playing' && quizData.length > 0 && (
                <Quiz
                    data={quizData[currentQuestion]}
                    totalQuestions={quizData.length}
                    currentQuestion={currentQuestion}
                    onAnswerSelect={handleAnswerSelect}
                    selectedAnswers={selectedAnswers}
                    answerFeedback={answerFeedback}
                    timer={timer}
                />
            )}
            {gameStatus === 'finished' && (
                <Results score={score} total={quizData.length} onRestart={handleRestart} />
            )}
        </div>
    );
}

export default App;
