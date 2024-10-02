import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './modules/auth/auth.route';
import documentRoute from './modules/document/document.route';
import Document from './modules/document/document.model';
import { connectDB } from './db';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express()
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Allow all origins for development
        methods: ['GET', 'POST', "PUT"],
    }
});

app.use(cors({
    origin: "http://localhost:3000", // Allow your frontend to connect
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/document', documentRoute);
// Socket.IO connection with JWT validation
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, 'abcsjjs');
    (socket as any).user = decoded;
    next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('edit-document', async ({ documentId, content, userId }) => {
      console.log('document',documentId,userId)
      // Find the document
      const document :any= await Document.findById(documentId);
  
      // Save the current content to the version history
      document.versionHistory.push({ content: document.content, timestamp: new Date() });
  
      // Update the document with the new content
      document.content = content;
  
      // Save the updated document
      await document.save();
  
      // Emit the updated content to other clients
      socket.broadcast.emit('document-updated', { documentId, content, userId });
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
});

// Start the server
const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
