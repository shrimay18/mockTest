import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    id: 3,
    text: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2
  },
  {
    id: 4,
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3
  },
  {
    id: 5,
    text: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Silver", "Oxygen", "Iron"],
    correctAnswer: 2
  }
];

const ExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(mockQuestions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [showTimer, setShowTimer] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentQuestionIndex)) {
      setBookmarks(bookmarks.filter(b => b !== currentQuestionIndex));
    } else {
      setBookmarks([...bookmarks, currentQuestionIndex]);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const currentQuestion = mockQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Mock Exam: {examId}</h1>
          <div className="flex items-center space-x-4">
            <span>Question {currentQuestionIndex + 1}/{mockQuestions.length}</span>
            {showTimer && (
              <span className="text-lg font-semibold">{formatTime(timeLeft)}</span>
            )}
            <button 
              onClick={() => setShowTimer(!showTimer)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showTimer ? 'Hide Timer' : 'Show Timer'}
            </button>
            <button 
              onClick={toggleBookmark}
              className={`text-yellow-500 hover:text-yellow-600 ${bookmarks.includes(currentQuestionIndex) ? 'font-bold' : ''}`}
            >
              {bookmarks.includes(currentQuestionIndex) ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{currentQuestion.text}</h2>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full p-4 text-left rounded-md transition-colors ${
                userAnswers[currentQuestionIndex] === index
                  ? userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
                    ? 'bg-green-200 hover:bg-green-300'
                    : 'bg-red-200 hover:bg-red-300'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === mockQuestions.length - 1}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;