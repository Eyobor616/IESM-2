import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, Quiz } from '../../types';

interface QuizViewProps {
  course: Course;
  quiz: Quiz;
  onBack: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ course, quiz, onBack }) => {
  const { currentUser, submitQuiz } = useApp();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!currentUser) return;
    if (selectedAnswers.includes(-1)) {
        alert("Please answer all questions before submitting.");
        return;
    }

    let correctAnswers = 0;
    quiz.questions.forEach((q, index) => {
      if (q.correctAnswerIndex === selectedAnswers[index]) {
        correctAnswers++;
      }
    });

    const calculatedScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setIsSubmitted(true);

    submitQuiz({
      userId: currentUser.id,
      quizId: quiz.id,
      score: calculatedScore,
      answers: selectedAnswers,
    });
  };

  if (isSubmitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-dark-text mb-4">Quiz Results</h1>
        <p className="text-lg text-medium-text mb-2">You scored:</p>
        <p className={`text-5xl font-bold mb-6 ${score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
          {score}%
        </p>
        <p className="text-medium-text mb-6">{score >= 70 ? 'Congratulations! You passed.' : 'You did not pass. Please review the course material.'}</p>
        <button onClick={onBack} className="px-6 py-3 bg-brand-secondary text-white font-bold rounded-lg hover:opacity-90">
          Back to Course
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
            <button onClick={onBack} className="text-brand-secondary hover:underline font-semibold mb-2">
                &larr; Back to {course.title}
            </button>
            <h1 className="text-3xl font-bold text-dark-text">{quiz.title}</h1>
        </div>
        <div className="text-medium-text font-semibold">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-dark-text mb-4">{currentQuestion.text}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentQuestionIndex] === index
                  ? 'bg-brand-secondary text-white border-brand-secondary'
                  : 'bg-white text-dark-text border-gray-300 hover:bg-gray-100'
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <button 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
             <button onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                Submit Quiz
             </button>
        ) : (
            <button 
                onClick={handleNext} 
                className="px-6 py-2 bg-brand-secondary text-white font-semibold rounded-lg hover:opacity-90"
            >
                Next
            </button>
        )}
      </div>
    </div>
  );
};

export default QuizView;
