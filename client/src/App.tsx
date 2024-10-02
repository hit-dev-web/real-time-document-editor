import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import SignUp from './components/Signup';
import CreateDocument from './components/CreateDocument';
import DocumentEditor from './components/Document';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/create" element={<CreateDocument />} />
      <Route path="/edit/:id" element={<DocumentEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
