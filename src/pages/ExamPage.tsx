import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import { BookmarkIcon } from 'lucide-react';
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
    const [examCompleted, setExamCompleted] = useState(false);
  
    const totalQuestionsInFirstHalf = Math.ceil(mockQuestions.length / 2);
  
    useEffect(() => {
      let timer: NodeJS.Timeout;
      if (!isBreakTime && !examCompleted) {
        timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(timer);
              setExamCompleted(true);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
  
      return () => clearInterval(timer);
    }, [isBreakTime, examCompleted]);
  
    const handleAnswer = (optionIndex: number) => {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestionIndex] = optionIndex;
      setUserAnswers(newAnswers);
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
      setExamCompleted(true);
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
  
    const toggleBookmark = () => {
      if (bookmarks.includes(currentQuestionIndex)) {
        setBookmarks(bookmarks.filter(b => b !== currentQuestionIndex));
      } else {
        setBookmarks([...bookmarks, currentQuestionIndex]);
      }
    };
  
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
            <div className="flex flex-col items-center">
              {showTimer && (
                <span className="text-lg sm:text-xl md:text-2xl font-semibold">{formatTime(timeLeft)}</span>
              )}
              <button 
                onClick={() => setShowTimer(!showTimer)}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 mt-1"
              >
                {showTimer ? 'Hide' : 'Show Timer'}
              </button>
            </div>
          </div>
        </nav>
  
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
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
          </div>
        </div>
      </div>
    );
  };
  
  export default ExamPage;