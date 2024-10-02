// src/components/DocumentListing.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css'; // Importing a CSS file for styles

interface Document {
  _id: string;
  title: string;
}

const DocumentListing: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/document'); // Update with your API endpoint
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) {
    return <div className="loading">Loading documents...</div>;
  }

  return (
    <div className="document-listing">
      <h2>Available Documents</h2>
      <ul>
        {documents.map((document:any) => (
          <li key={document._id} className="document-item">
            <p>
              {document.content}
              </p>
            <Link to={`edit/${document._id}`} className="document-link">
              {'Edit'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentListing;
