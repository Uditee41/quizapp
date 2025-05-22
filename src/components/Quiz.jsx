import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import './Quiz.css'; // Optional: For additional styling

export default function Quiz({
    data,
    currentQuestion,
    totalQuestions,
    onAnswerSelect,
    selectedAnswers,
    answerFeedback,
    timer
}) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    useEffect(() => {
        setSelectedAnswer(null); // Reset when question changes
    }, [currentQuestion]);

    const handleSelect = (isCorrect, answerId) => {
        if (selectedAnswer !== null) return; // Prevent re-selection
        setSelectedAnswer(answerId);
        onAnswerSelect(isCorrect, answerId);
    };

    if (!data || !data.options || !Array.isArray(data.options)) {
        return <div>Loading question or invalid data!</div>;
    }

    return (
        <div className="quiz-container">
            <ProgressBar current={currentQuestion + 1} total={totalQuestions} />
            <div className="quiz-header">
                <h2 className="question-number">Question {currentQuestion + 1} of {totalQuestions}</h2>
                <div className="timer">⏳ Time left: {timer}s</div>
            </div>
            <h3 className="question-text">{data.question}</h3>
            <div className="answers-grid">
                {data.options.map(option => (
                    <button
                        key={option.id}
                        onClick={() => handleSelect(option.isCorrect, option.id)}
                        className={`answer-button ${
                            selectedAnswer === option.id
                                ? option.isCorrect
                                    ? 'correct'
                                    : 'incorrect'
                                : ''
                        } ${selectedAnswers.includes(option.id) ? 'disabled' : ''}`}
                        disabled={selectedAnswers.includes(option.id)}
                        role="radio"
                        aria-checked={selectedAnswer === option.id}
                    >
                        {option.text}
                    </button>
                ))}
            </div>
            <span
                aria-live="polite"
                className="answer-feedback"
                style={{
                    visibility: answerFeedback ? 'visible' : 'hidden',
                    color: answerFeedback === 'correct' ? 'green' : 'red',
                    fontWeight: 'bold',
                    marginTop: '1rem',
                    display: 'inline-block'
                }}
            >
                {answerFeedback === 'correct' ? '✅ Correct!' : answerFeedback === 'incorrect' ? '❌ Incorrect.' : ''}
            </span>
        </div>
    );
}
