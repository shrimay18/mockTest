import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MockExamCardHolder from './pages/MockExamCardHolder';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/mock-exam" element={<MockExamCardHolder />} />
        <Route path="/" element={<Navigate replace to="/mock-exam" />} />
      </Routes>
    </Router>
  );
};

export default App;