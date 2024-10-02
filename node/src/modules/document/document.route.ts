// src/routes/authRoute.ts

import express from 'express';
import { DocumentController } from './document.controller';

const documentController = new DocumentController()
const router = express.Router();
router.post('/', documentController.createDocument)
router.put('/:id', documentController.updateDocument)
router.get('/:id', documentController.getDocument)
router.get('/', documentController.getDocuments)

export default router;
