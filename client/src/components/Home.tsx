// src/components/Home.tsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DocumentEditor from './Document';
import DocumentListing from './List'; // Import the DocumentListing component
import '../App.css';

const Home: React.FC = () => {
  useEffect(() => {
    if (localStorage.getItem('token')) {
      getUser();
    }
  }, []);

  const getUser = async () => {
    // API call to get user data (if needed)
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="title">Welcome to the Document Editor</h1>
        <nav className="nav-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Signup</Link>
        </nav>
      </header>

      <main className="main-content">
        <DocumentListing /> {/* Include the DocumentListing component */}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Document Editor. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
