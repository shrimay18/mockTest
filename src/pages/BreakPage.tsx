import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import  ConfettiExplosion  from 'react-confetti-explosion';

interface BreakPageProps {
  questionsAttempted: number;
  totalQuestionsInFirstHalf: number;
  examTimeLeft: number;
  breakTimeLeft: number;
  onBreakEnd: () => void;
}

const BreakPage: React.FC<BreakPageProps> = ({
  questionsAttempted,
  totalQuestionsInFirstHalf,
  examTimeLeft,
  breakTimeLeft,
  onBreakEnd
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (breakTimeLeft <= 0) {
      onBreakEnd();
    }
  }, [breakTimeLeft, onBreakEnd]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const progress = (questionsAttempted / totalQuestionsInFirstHalf) * 100;

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 max-w-md w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4 text-center">Break Time!</h1>
        
        {showConfetti && <ConfettiExplosion duration={2500} onComplete={() => setShowConfetti(false)} />}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-2xl text-blue-500 text-center mb-6"
        >
          You've made it halfway!
        </motion.div>

        <div className="space-y-4">
          <div className="text-lg font-semibold text-gray-700">
            Exam time left: {formatTime(examTimeLeft)}
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Break timer: {formatTime(breakTimeLeft)}
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Questions solved: {questionsAttempted} out of {totalQuestionsInFirstHalf}
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {progress.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
            </div>
          </div>
        </div>

        <button
          onClick={onBreakEnd}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Skip Break
        </button>
      </div>
    </div>
  );
};

export default BreakPage;

