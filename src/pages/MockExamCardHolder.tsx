// src/pages/MockExamCardHolder.tsx

import React from 'react';
import MockExamCard from '../components/MockExamCard';

const MockExamCardHolder: React.FC = () => {
    const mockExams = [
    {
      title: "Math Mock Exam",
      description: "Test your math skills with this comprehensive mock exam.",
      duration: 60,
      questionCount: 3
    },
    {
      title: "Science Mock Exam",
      description: "Prepare for your science exam with this practice test.",
      duration: 90,
      questionCount: 4
    },
    {
      title: "English Mock Exam",
      description: "Enhance your English language proficiency with this mock exam.",
      duration: 75,
      questionCount: 4
    }
    ];

    return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-500 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">Mock Exams</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockExams.map((exam, index) => (
            <MockExamCard
              key={index}
              title={exam.title}
              description={exam.description}
              duration={exam.duration}
              questionCount={exam.questionCount}
            />
          ))}
        </div>
      </div>
    </div>
    );
};

export default MockExamCardHolder;