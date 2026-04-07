import axios from 'axios';

const BASE_URL = '';

/**
 * Send a user message (with optional history) to NyayBot and receive structured legal advice.
 * @param {string} message - The user's legal problem description.
 * @param {Array<{role: string, content: string}>} history - Previous conversation turns.
 * @param {string} language - Preferred response language ('auto', 'English', 'Hindi', 'Tamil').
 * @returns {Promise<Object>} - Structured response: { reply, applicable_law, summary, next_steps, disclaimer, is_structured }
 */
export async function sendChatMessage(message, history = [], language = 'auto') {
  const response = await axios.post(`${BASE_URL}/api/chat`, {
    message,
    history,
    language,
  });
  return response.data;
}

/**
 * Request a Legal Notice PDF from the backend.
 * @param {Object} params
 * @param {string} params.applicable_law - The identified Indian law.
 * @param {string} params.complaint_text - Description of the grievance.
 * @param {string} [params.user_language] - Language of the notice.
 * @param {string} [params.complainant_name] - Name of the complainant.
 * @param {string} [params.respondent_name] - Name of the respondent.
 * @param {string} [params.complainant_address] - Address of the complainant.
 * @param {string} [params.respondent_address] - Address of the respondent.
 * @returns {Promise<Blob>} - PDF file as a Blob.
 */
export async function generatePDF(params) {
  const response = await axios.post(`${BASE_URL}/api/generate-pdf`, params, {
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Search for DLSA (District Legal Services Authority) offices near a location.
 * @param {string} query - District or state name.
 * @returns {Promise<Array>} - Array of DLSA entries.
 */
export async function searchDLSA(query) {
  const response = await axios.get(`${BASE_URL}/api/dlsa`, {
    params: { q: query },
  });
  return response.data.results || [];
}

