import React, { useState, useEffect, useRef, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import { BookmarkIcon, Info, FileText,X, ArrowLeft,ArrowRight } from 'lucide-react';
import BreakPage from './BreakPage';
import ResultPage from './ResultPage';
import GuidelinesPage from './GuidelinesPage';

interface ReferenceModalProps {
  onClose: () => void;
}
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
const ReferenceModal: React.FC<ReferenceModalProps> = React.memo(({ onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-lg w-full h-full sm:w-11/12 sm:h-5/6 max-w-4xl max-h-full flex flex-col overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-blue-800">Reference Material</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-hidden">
        <iframe
          src="/reference-material.pdf"
          className="w-full h-full"
          title="Reference Material"
        />
      </div>
    </div>
  </div>
));


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
    const [breakTimeLeft, setBreakTimeLeft] = useState(600); // 1.5 minutes in seconds
    const [breakTaken, setBreakTaken] = useState(false);
    const [showReferenceModal, setShowReferenceModal] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handleCloseModal = useCallback(() => {
      setShowReferenceModal(false);
    }, []);
    const totalQuestionsInFirstHalf = Math.ceil(mockQuestions.length / 2);
    const isFirstHalf = currentQuestionIndex < totalQuestionsInFirstHalf;
    const isSmallScreen = windowWidth < 640; 
    const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0 });
    const infoBtnRef = useRef<HTMLButtonElement>(null);
    const paletteRef = useRef<HTMLDivElement>(null);
    const totalQuestions = mockQuestions.length;
    const questionsBeforeBreak = Math.ceil(totalQuestions / 2);
    const [showGuidelines, setShowGuidelines] = useState(true);
    const [examStarted, setExamStarted] = useState(false);

  
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        updatePalettePosition();
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      updatePalettePosition();
    }, [showPalette]);

    const updatePalettePosition = () => {
      if (infoBtnRef.current && windowWidth >= 640) {
        const rect = infoBtnRef.current.getBoundingClientRect();
        setPalettePosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX - 250, // Adjust this value to fine-tune the horizontal position
        });
      }
    };
  
    const handleStartExam = () => {
      setShowGuidelines(false);
      setExamStarted(true);
    };
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
      setBreakTaken(true);
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
  
    const handleInfoClick = () => {
      setShowPalette(prev => !prev);
    };
    if (showGuidelines) {
      return <GuidelinesPage onStart={handleStartExam} />;
    }
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
    const QuestionPalette = () => {
      const visibleQuestions = breakTaken ? mockQuestions : mockQuestions.slice(0, questionsBeforeBreak);
      return(
        <div 
        ref={paletteRef}
        className={`fixed bg-white p-4 rounded-lg shadow-lg overflow-y-auto z-50 ${
          isSmallScreen ? 'inset-0' : ''
        }`}
        style={isSmallScreen ? {} : {
          top: `${palettePosition.top}px`,
          left: `${palettePosition.left}px`,
          width: '300px',
          maxHeight: '80vh'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">Question Palette</h3>
          <button onClick={() => setShowPalette(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {mockQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestionIndex(index);
                setShowPalette(false);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                getQuestionStatus(index) === 'solved' ? 'bg-green-500' :
                getQuestionStatus(index) === 'review' ? 'bg-yellow-500' :
                getQuestionStatus(index) === 'attempted-review' ? 'bg-purple-500' :
                'bg-blue-300'
              } ${currentQuestionIndex === index ? 'ring-2 ring-offset-2 ring-blue-600' : ''}
              ${(!breakTaken && index >= questionsBeforeBreak) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!breakTaken && index >= questionsBeforeBreak}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div className="mt-4 text-xs">
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Solved</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Marked for Review</span>
          </div>
          <div className="flex items-center mb-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span>Attempted & Marked for Review</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-300 rounded-full mr-2"></div>
            <span>Unsolved</span>
          </div>
        </div>
      </div>
      ); 
    };
  
    const currentQuestion = mockQuestions[currentQuestionIndex];
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-md p-2 sm:p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-white truncate flex-shrink-0 max-w-[30%]">
            {examId}
          </h1>
          <div className="flex flex-col items-center">
            {showTimer && (
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white">
                {formatTime(timeLeft)}
              </span>
            )}
            <button 
              onClick={() => setShowTimer(!showTimer)}
              className="text-xs sm:text-sm text-white hover:text-blue-200"
            >
              {showTimer ? 'Hide' : 'Show Timer'}
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowReferenceModal(true)}
              className="bg-white rounded-full p-1 sm:p-1.5 shadow-md text-blue-600 hover:text-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-110"
            >
              <FileText size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              ref={infoBtnRef}
              onClick={handleInfoClick}
              className="bg-white rounded-full p-1 sm:p-1.5 shadow-md text-blue-600 hover:text-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-110"
            >
              <Info size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </nav>
        <main className="max-w-3xl mx-auto mt-4 sm:mt-8 px-2 sm:px-4 lg:px-8">
          <div className="text-center mb-2 sm:mb-4 text-blue-600 text-sm sm:text-base font-semibold">
            Question {currentQuestionIndex + 1} of {mockQuestions.length}
        </div>
        <div className="bg-white rounded-lg shadow-lg relative p-3 sm:p-6 border border-blue-200">
          <button 
            onClick={toggleBookmark}
            className={`absolute top-2 sm:top-4 right-2 sm:right-4 text-blue-500 hover:text-blue-600 transition-all duration-300 transform ${
              bookmarks.includes(currentQuestionIndex) ? 'scale-110' : 'scale-100'
            }`}
          >
            <BookmarkIcon 
              size={20} 
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill={bookmarks.includes(currentQuestionIndex) ? "currentColor" : "none"}
            />
          </button>
          
          <h2 className="text-base sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4 pr-8 sm:pr-10 text-blue-800">
            {currentQuestion.text}
          </h2>
          
          <div className="space-y-2 sm:space-y-4 mb-4 sm:mb-6">
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
          
          <div className="flex justify-between items-center border-t pt-4 sm:pt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-white text-sm sm:text-base ${
                currentQuestionIndex === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <ArrowLeft size={16} className="mr-1 sm:mr-2" />
              Previous
            </button>
            
            
            
            {currentQuestionIndex === mockQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-white bg-green-600 hover:bg-green-700 text-sm sm:text-base"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
              >
                Next
                <ArrowRight size={16} className="ml-1 sm:ml-2" />
              </button>
            )}
          </div>
        </div>
      </main>

      {showReferenceModal && <ReferenceModal onClose={() => setShowReferenceModal(false)} />}
      {showPalette && <QuestionPalette />}
    </div>
  );
};
  
export default ExamPage;