import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Smile, Frown, PartyPopper } from 'lucide-react';
import Confetti from 'react-confetti';

interface ResultPageProps {
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattemptedQuestions: number;
  timeSpent: number;
  onCheckAnswers: () => void;
}

const ResultPage: React.FC<ResultPageProps> = ({
  totalQuestions,
  attemptedQuestions,
  correctAnswers,
  timeSpent,
  onCheckAnswers
}) => {
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  const getResultMessage = () => {
    if (score <= 50) {
      return {
        icon: <Frown size={48} className="text-yellow-500" />,
        message: "\"Don't worry champ, let's cheer up and revisit the concept and improve in next exam!\"",
        animation: "shake",
        color: "text-yellow-600"
      };
    } else if (score <= 75) {
      return {
        icon: <Smile size={48} className="text-blue-500" />,
        message: "\"You were almost there, just a little more effort and then sky is the limit!\"",
        animation: "pulse",
        color: "text-blue-600"
      };
    } else {
      return {
        icon: <PartyPopper size={48} className="text-green-500" />,
        message: "\"Well done champ! Keep the hard work coming!\"",
        animation: "bounce",
        color: "text-green-600"
      };
    }
  };

  const { icon, message, animation, color } = getResultMessage();

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

  const CircleResult = ({ value, total, label, color }: { value: number, total: number, label: string, color: string }) => (
    <div className="flex flex-col items-center mb-6">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <motion.div 
        className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 ${color} flex items-center justify-center`}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold">{value}</div>
          <div className="text-xs sm:text-sm">out of</div>
          <div className="text-lg sm:text-xl">{total}</div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {score > 75 && <Confetti recycle={true} />}
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Exam Results</h1>
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
            className={`text-center text-lg md:text-xl font-semibold mb-8 ${color} italic`}
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
              color="border-blue-500" 
            />
            <CircleResult 
              value={correctAnswers} 
              total={totalQuestions} 
              label="Marks Scored" 
              color="border-green-500" 
            />
          </div>
          <motion.p 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-6"
          >
            <strong>Time Spent:</strong> {Math.floor(timeSpent / 60)} minutes {timeSpent % 60} seconds
          </motion.p>
          <motion.button
            onClick={onCheckAnswers}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Check Your Answers
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage;