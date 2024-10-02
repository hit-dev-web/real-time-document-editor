// client/src/services/documentService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/document';

export const createDocument = async (title: string, content: string) => {
    const response = await axios.post(API_URL, { title, content });
    return response.data;
};

export const getDocument = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const updateDocument = async (id: string, content: string) => {
    const response = await axios.put(`${API_URL}/${id}`, { content });
    return response.data;
};

export const getDocumentVersions = async (id: string) => {
    const response = await axios.get(`${API_URL}/${id}/versions`);
    return response.data;
};
