import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { getDocument } from '../utils/document.service';
import { Link, useParams } from 'react-router-dom';
import '../App.css'; // Import your CSS for styling

const socket = io('http://localhost:3001', {
    auth: {
        token: localStorage.getItem('token'), // Ensure this is set correctly
    },
});

const DocumentEditor: React.FC = () => {
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [versionHistory, setVersionHistory] = useState([]);
    const [userId, setUserId] = useState('');
    const [newComment, setNewComment] = useState('');
    let { id }: any = useParams();

    useEffect(() => {
        const fetchDocument = async () => {
            const response = await getDocument(id);
            setContent(response.content);
            setVersionHistory(response.versionHistory);
            setUserId('d');
        };

        fetchDocument();

        socket.on('document-updated', ({ content }) => {
            setContent(content); // Update local state with the new content from other users
        });

        return () => {
            socket.off('document-updated');
        };
    }, [id]);

    const handleChange = (e: any) => {
        const newContent = e.target.value;
        setContent(newContent);
        socket.emit('edit-document', { id, content: newContent, userId }); // Send the new content to the server
    };

    const handleCommentSubmit = async () => {
        if (!newComment) return; // Prevent empty comments
        try {
            await axios.post('http://localhost:3001/add-comment', {
                id,
                userId,
                comment: newComment,
                section: 'Section1',
            });
            setNewComment(''); // Clear input after submitting
        } catch (e) {
            console.log(e);
        }
    };

    const renderContentWithAuthorship = (content: string) => {
        const lines = content.split('\n').map((line, index) => {
            const version: any = versionHistory[versionHistory.length - 1]; // Get the latest version
            const userIdForLastEdit = version ? version.userId : null;

            return (
                <p key={index} className={userIdForLastEdit === userId ? 'highlighted' : 'highlighted'}>
                    {line}
                </p>
            );
        });

        return lines;
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
            <div className="document-editor">
                <header className="editor-header">
                    <h1>Document Title</h1>
                    <div className="user-info">
                        <span>User: {userId}</span>
                        {/* Optional Profile Picture */}
                    </div>
                    <button className="save-button">Save</button>
                </header>
                <div className="editor-area">
                    <textarea
                        value={content}
                        onChange={handleChange}
                        className="editor-textarea"
                    />
                </div>
                <div className="comments-section">
                    <h2>Comments</h2>
                    <div className="comments-list">
                        {comments.map((comment: any, index) => (
                            <div key={index} className="comment-item">
                                <strong>{comment.userId}</strong>: {comment.comment} (Section: {comment.section})
                            </div>
                        ))}
                    </div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="comment-input"
                    />
                    <button onClick={handleCommentSubmit} className="submit-comment-button">
                        Add Comment
                    </button>
                </div>
                <h3>Document Content</h3>
                <div className="document-content">
                    {renderContentWithAuthorship(content)} {/* Display content with authorship highlighting */}
                </div>
                <footer className="editor-footer">
                    <span>Status: Unsaved</span>
                    <span>Last edited: Just now</span>
                </footer>
            </div>
        </div>
    );
};

export default DocumentEditor;
