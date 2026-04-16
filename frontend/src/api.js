import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Streaming version of sendChatMessage using fetch.
 * Returns a ReadableStream of tokens.
 */
export async function streamChatMessage(message, history = [], language = 'auto') {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, language }),
  });

  if (!response.ok) throw new Error('Network response was not ok');
  return response.body;
}

/**
 * Legacy/Non-streaming version (kept for compatibility)
 */
export async function sendChatMessage(message, history = [], language = 'auto') {
  const response = await axios.post(`${BASE_URL}/api/chat`, {
    message,
    history,
    language,
  });
  return response.data;
}

export async function generatePDF(params) {
  const response = await axios.post(`${BASE_URL}/api/generate-pdf`, params, {
    responseType: 'blob',
  });
  return response.data;
}

export async function searchDLSA(query) {
  const response = await axios.get(`${BASE_URL}/api/dlsa`, {
    params: { q: query },
  });
  return response.data.results || [];
}
