import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookmarkIcon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BreakPage from './BreakPage';
import ResultPage from './ResultPage';

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
  },
  {
    id: 6,
    text: "What is the capital of Japan?",
    options: ["Tokyo", "Beijing", "Seoul", "Bangkok"],
    correctAnswer: 0
  },
  {
    id: 7,
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    correctAnswer: 1
  },
  {
    id: 8,
    text: "What is the largest mammal in the world?",
    options: ["Elephant", "Blue whale", "Giraffe", "Hippopotamus"],
    correctAnswer: 1
  },
  {
    id: 9,
    text: "What is the currency of Brazil?",
    options: ["Peso", "Dollar", "Real", "Euro"],
    correctAnswer: 2
  },
  {
    id: 10,
    text: "What is the tallest mountain in the world?",
    options: ["Mount Kilimanjaro", "Mount Everest", "Mount Fuji", "Mount Rushmore"],
    correctAnswer: 1
  }
];

const ExamPage: React.FC = () => {
const { examId } = useParams<{ examId: string }>();
const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(mockQuestions.length).fill(null));
const [bookmarks, setBookmarks] = useState<number[]>([]);
const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
const [showTimer, setShowTimer] = useState(true);
const [showBreak, setShowBreak] = useState(false);
const [isBreakTime, setIsBreakTime] = useState(false);
const [showResult, setShowResult] = useState(false);
const [showPalette, setShowPalette] = useState(false);

const totalQuestionsInFirstHalf = Math.ceil(mockQuestions.length / 2);
const isFirstHalf = currentQuestionIndex < totalQuestionsInFirstHalf;
  
useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isBreakTime && !showResult) {
    timer = setInterval(() => {
        setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
            clearInterval(timer);
            setShowResult(true);
            return 0;
        }
        return prevTime - 1;
        });
    }, 1000);
}

return () => clearInterval(timer);
}, [isBreakTime, showResult]);

  
const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const toggleBookmark = () => {
    if (bookmarks.includes(currentQuestionIndex)) {
      setBookmarks(bookmarks.filter(index => index !== currentQuestionIndex));
    } else {
      setBookmarks([...bookmarks, currentQuestionIndex]);
    }
  };

  const getQuestionStatus = (index: number) => {
    if (userAnswers[index] !== null) return 'solved';
    if (bookmarks.includes(index)) return 'review';
    return 'unsolved';
  };
  
    const handleNext = () => {
      if (currentQuestionIndex < mockQuestions.length - 1) {
        if (currentQuestionIndex === totalQuestionsInFirstHalf - 1) {
          setShowBreak(true);
          setIsBreakTime(true);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }
    };
  
    const handlePrevious = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    };
  
    const handleBreakEnd = () => {
      setShowBreak(false);
      setIsBreakTime(false);
      setCurrentQuestionIndex(totalQuestionsInFirstHalf);
    };
  
    const handleSubmit = () => {
        setShowResult(true);
    };
  
    const handleCheckAnswers = () => {
      setShowResult(false);
      setCurrentQuestionIndex(0);
    };
  
    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
  
    const QuestionPalette = () => (
        <div className="fixed right-4 top-20 bg-white p-4 rounded-lg shadow-lg max-w-sm w-full sm:w-80 max-h-[80vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Question Palette</h3>
          <div className="grid grid-cols-5 gap-2">
            {mockQuestions.slice(0, isFirstHalf ? totalQuestionsInFirstHalf : undefined).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  getQuestionStatus(index) === 'solved' ? 'bg-green-500' :
                  getQuestionStatus(index) === 'review' ? 'bg-yellow-500' : 'bg-gray-400'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm">
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>Solved</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
              <span>Unsolved</span>
            </div>
          </div>
        </div>
      );

    if (showBreak) {
        const questionsAttempted = userAnswers.slice(0, totalQuestionsInFirstHalf).filter(answer => answer !== null).length;
        return (
          <BreakPage
            questionsAttempted={questionsAttempted}
            totalQuestionsInFirstHalf={totalQuestionsInFirstHalf}
            examTimeLeft={timeLeft}
            onBreakEnd={handleBreakEnd}
          />
        );
    }
    
    if (showResult) {
        const attemptedQuestions = userAnswers.filter(answer => answer !== null).length;
        const correctAnswers = userAnswers.filter((answer, index) => answer === mockQuestions[index].correctAnswer).length;
        const wrongAnswers = attemptedQuestions - correctAnswers;
        const unattemptedQuestions = mockQuestions.length - attemptedQuestions;
        const timeSpent = 3600 - timeLeft;
    
        return (
            <ResultPage
              totalQuestions={mockQuestions.length}
              attemptedQuestions={attemptedQuestions}
              correctAnswers={correctAnswers}
              wrongAnswers={wrongAnswers}
              unattemptedQuestions={unattemptedQuestions}
              timeSpent={timeSpent}
              onCheckAnswers={handleCheckAnswers}
              questions={mockQuestions}
              userAnswers={userAnswers}
            />
        );
    }
  
    const currentQuestion = mockQuestions[currentQuestionIndex];
  
    return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl truncate">
            Mock Exam: {examId}
          </h1>
          <div className="flex items-center space-x-4">
            {showTimer && (
              <span className="text-lg sm:text-xl md:text-2xl font-semibold">{formatTime(timeLeft)}</span>
            )}
            <button 
              onClick={() => setShowTimer(!showTimer)}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
            >
              {showTimer ? 'Hide' : 'Show Timer'}
            </button>
          </div>
        </div>
      </nav>
      
      <button
        onClick={() => setShowPalette(!showPalette)}
        className="fixed top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md text-blue-600 hover:text-blue-800"
      >
        <Info size={24} />
      </button>

      {showPalette && <QuestionPalette />}

      <div className="max-w-3xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md relative p-6">
          <button 
            onClick={toggleBookmark}
            className={`absolute top-4 right-4 text-yellow-500 hover:text-yellow-600 transition-all duration-300 transform ${bookmarks.includes(currentQuestionIndex) ? 'scale-110' : 'scale-100'}`}
          >
            <BookmarkIcon size={24} fill={bookmarks.includes(currentQuestionIndex) ? "currentColor" : "none"} />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 pr-10">{currentQuestion.text}</h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 text-left rounded-md transition-colors ${
                  userAnswers[currentQuestionIndex] === index
                    ? 'bg-blue-200 hover:bg-blue-300'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-300 text-sm sm:text-base"
            >
              Previous
            </button>
            {currentQuestionIndex === mockQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-sm sm:text-base"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Next
              </button>
            )}
          </div>
        </div>
        <div className="text-center mt-4 text-gray-600 text-sm sm:text-base">
          Question {currentQuestionIndex + 1} of {isFirstHalf ? totalQuestionsInFirstHalf : mockQuestions.length}
        </div>
      </div>
    </div>
  );
  };
  
  export default ExamPage;