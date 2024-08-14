import React, { useState } from 'react';

interface GuidelinesPageProps {
  onStart: () => void;
}

const GuidelinesPage: React.FC<GuidelinesPageProps> = ({ onStart }) => {
  const [isChecked, setIsChecked] = useState(false);

  const guidelines = [
    "Read each question carefully before answering.",
    "You have a total of 60 minutes to complete the exam.",
    "There will be a break after the first half of the questions.",
    "You can mark questions for review and come back to them later.",
    "Ensure you have a stable internet connection throughout the exam.",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-500 to-blue-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 sm:mb-6">Exam Guidelines</h1>
        <ul className="list-disc pl-5 mb-6 sm:mb-8 space-y-1 sm:space-y-2">
          {guidelines.map((guideline, index) => (
            <li key={index} className="text-sm sm:text-base text-gray-700">{guideline}</li>
          ))}
        </ul>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2 sm:mb-4">Terms and Conditions</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            By proceeding with this exam, you agree to abide by all rules and regulations set forth by the examining body. Any form of cheating or misconduct will result in immediate disqualification.
          </p>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
            />
            <span className="text-sm sm:text-base text-gray-700">I agree to the terms and conditions</span>
          </label>
        </div>
        <button
          onClick={onStart}
          disabled={!isChecked}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold text-sm sm:text-base ${
            isChecked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          } transition-colors duration-300`}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
};

export default GuidelinesPage;