// client/src/DocumentEditor.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const CreateDocument: React.FC =  () => {
    const [content, setContent] = useState('');
    
    
    const handleCommentSubmit = async () => {
      await axios.post('http://localhost:3001/api/document', {
        content,
      });
    };
  
    return (
      <div>
        <textarea value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={() => handleCommentSubmit()}>
          Add document
        </button>
      </div>
    );
  };
  
  export default CreateDocument;
  