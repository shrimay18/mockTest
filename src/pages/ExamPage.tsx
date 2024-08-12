import React, { useState, useEffect, useRef} from 'react';
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
    const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
    const [showTimer, setShowTimer] = useState(true);
    const [bookmarks, setBookmarks] = useState<number[]>([]);
    const [showBreak, setShowBreak] = useState(false);
    const [isBreakTime, setIsBreakTime] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showPalette, setShowPalette] = useState(false);
    const [breakTimeLeft, setBreakTimeLeft] = useState(90); // 1.5 minutes in seconds
    const [breakTaken, setBreakTaken] = useState(false);
  
    const totalQuestionsInFirstHalf = Math.ceil(mockQuestions.length / 2);
    const isFirstHalf = currentQuestionIndex < totalQuestionsInFirstHalf;
  
    const paletteRef = useRef<HTMLDivElement>(null);
    const infoBtnRef = useRef<HTMLButtonElement>(null);
  
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
      } else if (isBreakTime) {
        timer = setInterval(() => {
          setBreakTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(timer);
              handleBreakEnd();
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
  
      return () => clearInterval(timer);
    }, [isBreakTime, showResult]);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (showPalette && 
            paletteRef.current && 
            !paletteRef.current.contains(event.target as Node) &&
            infoBtnRef.current &&
            !infoBtnRef.current.contains(event.target as Node)) {
          setShowPalette(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showPalette]);
  
    const handleAnswer = (optionIndex: number) => {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = optionIndex;
      setUserAnswers(newAnswers);
      
      // Automatically move to the next question
      if (currentQuestionIndex < mockQuestions.length - 1) {
        handleNext();
      } else {
        setShowResult(true);
      }
    };
  
    const handleNext = () => {
      if (currentQuestionIndex < mockQuestions.length - 1) {
        if (currentQuestionIndex === totalQuestionsInFirstHalf - 1 && !breakTaken) {
          setShowBreak(true);
          setIsBreakTime(true);
          setBreakTaken(true);
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
      setBreakTimeLeft(90); // Reset break time for future use if needed
    };
  
    const handleSubmit = () => {
      setShowResult(true);
    };
  
    const toggleBookmark = () => {
      setBookmarks(prevBookmarks => 
        prevBookmarks.includes(currentQuestionIndex)
          ? prevBookmarks.filter(index => index !== currentQuestionIndex)
          : [...prevBookmarks, currentQuestionIndex]
      );
    };
  
    const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };
  
    const getQuestionStatus = (index: number) => {
      if (userAnswers[index] !== null && bookmarks.includes(index)) return 'attempted-review';
      if (userAnswers[index] !== null) return 'solved';
      if (bookmarks.includes(index)) return 'review';
      return 'unsolved';
    };
  
    const QuestionPalette = () => {
      const visibleQuestions = breakTaken ? mockQuestions : mockQuestions.slice(0, totalQuestionsInFirstHalf);
      
      return (
        <div ref={paletteRef} className="fixed right-2 sm:right-4 top-16 sm:top-20 bg-white p-2 sm:p-4 rounded-lg shadow-lg w-48 sm:w-64 max-h-[60vh] sm:max-h-[80vh] overflow-y-auto z-50">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-4 text-blue-800">Question Palette</h3>
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {visibleQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setShowPalette(false);
                }}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold ${
                  getQuestionStatus(index) === 'solved' ? 'bg-green-500' :
                  getQuestionStatus(index) === 'review' ? 'bg-yellow-500' :
                  getQuestionStatus(index) === 'attempted-review' ? 'bg-purple-500' :
                  'bg-blue-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="mt-2 sm:mt-4 text-xs">
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1 sm:mr-2"></div>
              <span>Solved</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full mr-1 sm:mr-2"></div>
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full mr-1 sm:mr-2"></div>
              <span>Attempted & Marked for Review</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 rounded-full mr-1 sm:mr-2"></div>
              <span>Unsolved</span>
            </div>
          </div>
        </div>
      );
    };
  
    if (showBreak) {
      return (
        <BreakPage
          questionsAttempted={totalQuestionsInFirstHalf}
          totalQuestionsInFirstHalf={totalQuestionsInFirstHalf}
          examTimeLeft={timeLeft}
          breakTimeLeft={breakTimeLeft}
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
          onCheckAnswers={() => setShowResult(false)}
          questions={mockQuestions}
          userAnswers={userAnswers}
        />
      );
    }
  
    const currentQuestion = mockQuestions[currentQuestionIndex];
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <nav className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-md p-2 sm:p-4 relative">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
            <h1 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl truncate w-full sm:w-auto text-center mb-2 sm:mb-0 text-white">
              Mock Exam: {examId}
            </h1>
            <div className="flex flex-col items-center sm:absolute sm:left-1/2 sm:top-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2">
              {showTimer && (
                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-1 text-white">{formatTime(timeLeft)}</span>
              )}
              <button 
                onClick={() => setShowTimer(!showTimer)}
                className="text-xs sm:text-sm text-white hover:text-blue-200"
              >
                {showTimer ? 'Hide' : 'Show Timer'}
              </button>
            </div>
            <div className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2">
              <button
                ref={infoBtnRef}
                onClick={() => setShowPalette(!showPalette)}
                className="bg-white rounded-full p-1 sm:p-2 shadow-md text-blue-600 hover:text-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-110"
              >
                <Info size={16} className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </nav>
  
        <div className="max-w-3xl mx-auto mt-4 sm:mt-8 px-2 sm:px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg relative p-3 sm:p-6 border border-blue-200"
          >
            <button 
              onClick={toggleBookmark}
              className={`absolute top-2 sm:top-4 right-2 sm:right-4 text-blue-500 hover:text-blue-600 transition-all duration-300 transform ${bookmarks.includes(currentQuestionIndex) ? 'scale-110' : 'scale-100'}`}
            >
              <BookmarkIcon 
                size={20} 
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill={bookmarks.includes(currentQuestionIndex) ? "currentColor" : "none"}
              />
            </button>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 pr-8 sm:pr-10 text-blue-800">{currentQuestion.text}</h2>
            <div className="space-y-2 sm:space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-2 sm:p-4 text-left rounded-md transition-colors text-sm sm:text-base ${
                    userAnswers[currentQuestionIndex] === index
                      ? 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="bg-blue-500 text-white py-1 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                Previous
              </button>
              {currentQuestionIndex === mockQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white py-1 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm hover:bg-green-600 transition-colors"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-blue-500 text-white py-1 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm hover:bg-blue-600 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
          <div className="text-center mt-2 sm:mt-4 text-blue-600 text-xs sm:text-sm">
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
          </div>
        </div>
        {showPalette && <QuestionPalette />}
      </div>
    
    );
  };
  
  export default ExamPage;