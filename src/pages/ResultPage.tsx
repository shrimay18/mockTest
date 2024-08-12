import React,{useState} from 'react';
import { motion,AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Smile, Frown, Award } from 'lucide-react';
import Confetti from 'react-confetti';
import AnswerReviewPopup from './AnswerReviewPopup';

interface Question {
    text: string;
    options: string[];
    correctAnswer: number;
}
interface ResultPageProps {
    totalQuestions: number;
    attemptedQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    unattemptedQuestions: number;
    timeSpent: number;
    onCheckAnswers: () => void;
    questions: Question[];
    userAnswers: (number | null)[];
}

const ResultPage: React.FC<ResultPageProps> = ({
  totalQuestions,
  attemptedQuestions,
  correctAnswers,
  timeSpent,
  onCheckAnswers,
  questions,
  userAnswers
}) => {
  const [showAnswerReview, setShowAnswerReview] = useState(false);
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const getResultMessage = () => {
    if (score <= 50) {
      return {
        icon: <Frown size={48} className="text-blue-500" />,
        message: "\"Don't worry champ, let's cheer up and revisit the concept and improve in next exam!\"",
        animation: "shake"
      };
    } else if (score <= 75) {
      return {
        icon: <Smile size={48} className="text-blue-500" />,
        message: "\"You were almost there, just a little more effort and then sky is the limit!\"",
        animation: "pulse"
      };
    } else {
      return {
        icon: <Award size={48} className="text-blue-500" />,
        message: "\"Well done champ! Keep the hard work coming!\"",
        animation: "bounce"
      };
    }
  };

  const { icon, message, animation } = getResultMessage();

  const animationVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { repeat: Infinity, duration: 1.5 }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: { repeat: Infinity, duration: 1.5 }
    },
    bounce: {
      y: [0, -20, 0],
      transition: { repeat: Infinity, duration: 1.5 }
    }
  };

  const CircleResult = ({ value, total, label }: { value: number, total: number, label: string }) => (
    <div className="flex flex-col items-center mb-6">
      <h3 className="text-lg font-semibold mb-2 text-black">{label}</h3>
      <motion.div 
        className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-blue-100 flex items-center justify-center relative overflow-hidden"
        initial={{ backgroundPosition: '0% 0%' }}
        animate={{ backgroundPosition: '100% 100%' }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: 'linear-gradient(45deg, #3B82F6 25%, #60A5FA 25%, #60A5FA 50%, #3B82F6 50%, #3B82F6 75%, #60A5FA 75%, #60A5FA 100%)',
          backgroundSize: '250% 250%',
        }}
      >
        <div className="text-center bg-white rounded-full w-24 h-24 sm:w-28 sm:h-28 flex flex-col justify-center items-center">
          <div className="text-2xl sm:text-3xl font-bold text-black">{value}</div>
          <div className="text-xs sm:text-sm text-black">out of</div>
          <div className="text-lg sm:text-xl text-black">{total}</div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {score > 75 && <Confetti numberOfPieces={200} recycle={true} />}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Exam Results</h1>
          <Link to="/mock-exam" className="text-blue-600 hover:text-blue-800">Go Back to Home</Link>
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-md w-full"
        >
          <motion.div
            className="flex justify-center mb-6"
            variants={animationVariants}
            animate={animation}
          >
            {icon}
          </motion.div>
          <motion.p 
            className="text-center text-lg md:text-xl font-semibold mb-8 text-blue-600 italic"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.p>
          <div className="flex flex-col sm:flex-row justify-around mb-6">
            <CircleResult 
              value={attemptedQuestions} 
              total={totalQuestions} 
              label="Questions Attempted" 
            />
            <CircleResult 
              value={correctAnswers} 
              total={totalQuestions} 
              label="Marks Scored" 
            />
          </div>
          <motion.p 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-6 text-black"
          >
            <strong>Time Spent:</strong> {Math.floor(timeSpent / 60)} minutes {timeSpent % 60} seconds
          </motion.p>
          <motion.button
            onClick={() => setShowAnswerReview(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Check Your Answers
          </motion.button>
        </motion.div>
      </div>
      <AnimatePresence>
        {showAnswerReview && (
          <AnswerReviewPopup
            questions={questions}
            userAnswers={userAnswers}
            onClose={() => setShowAnswerReview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultPage;