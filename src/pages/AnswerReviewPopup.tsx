import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface AnswerReviewPopupProps {
  questions: Question[];
  userAnswers: (number | null)[];
  onClose: () => void;
}

const AnswerReviewPopup: React.FC<AnswerReviewPopupProps> = ({ questions, userAnswers, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Answer Review</h2>
        {questions.map((question, index) => (
          <div key={index} className="mb-6 pb-4 border-b border-gray-200">
            <p className="font-semibold mb-2">{index + 1}. {question.text}</p>
            {question.options.map((option, optionIndex) => {
              const isUserAnswer = userAnswers[index] === optionIndex;
              const isCorrectAnswer = question.correctAnswer === optionIndex;
              let bgColor = 'bg-white';
              if (isUserAnswer && isCorrectAnswer) {
                bgColor = 'bg-green-100';
              } else if (isUserAnswer && !isCorrectAnswer) {
                bgColor = 'bg-red-100';
              } else if (isCorrectAnswer) {
                bgColor = 'bg-green-100';
              }
              return (
                <div
                  key={optionIndex}
                  className={`p-2 rounded mb-1 ${bgColor} ${isUserAnswer ? 'font-semibold' : ''}`}
                >
                  {option}
                  {isCorrectAnswer && <span className="ml-2 text-green-600">(Correct Answer)</span>}
                  {isUserAnswer && !isCorrectAnswer && <span className="ml-2 text-red-600">(Your Answer)</span>}
                </div>
              );
            })}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AnswerReviewPopup;