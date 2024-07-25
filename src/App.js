import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Task from './components/Task';
import Login from './components/Login';


function App() {
  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/tasks" element={<Task />} />
      <Route path="/" element={<Login />} />
    </Routes>
  </Router>
  );
}

export default App;
