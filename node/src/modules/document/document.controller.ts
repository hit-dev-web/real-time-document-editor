import { Request, Response } from 'express';
import Document from './document.model'; // Make sure your User model is imported
import mongoose from 'mongoose';

export class DocumentController {
  
  // Method to create a new document
  public async createDocument(req: Request, res: Response): Promise<any> {
    try {
      const { content, currentEditor } = req.body;
      const newDocument = new Document({ content, versionHistory: [{ version: 1, content, currentEditor }] });
      await newDocument.save();
      return res.status(201).json(newDocument);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Method to update an existing document
  public async updateDocument(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const document = await Document.findById(id);

      if (!document) {
        return res.status(404).send('Document not found');
      }

      // Increment version and save new content
      const newVersion = document.versionHistory.length + 1;
      document.versionHistory.push({ version: newVersion, content });
      document.content = content;
      await document.save();

      // Emit an event to notify clients about the update
      // io.emit('document-update', { id, content });

      return res.json(document);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Method to retrieve a single document by ID
  public async getDocument(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const objId = new mongoose.Types.ObjectId(id);
      const document = await Document.findById(objId);
      if (!document) {
        return res.status(404).send('Document not found');
      }
      return res.json(document);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Method to retrieve all documents
  public async getDocuments(req: Request, res: Response): Promise<any> {
    try {
      const documents = await Document.find({});
      if (!documents || documents.length === 0) {
        return res.status(404).send('No documents found');
      }
      return res.json(documents);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}