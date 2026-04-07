import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

/**
 * Send a user message to NyayBot and receive legal advice.
 * @param {string} message - The user's legal problem description.
 * @returns {Promise<string>} - The AI's reply.
 */
export async function sendChatMessage(message) {
  const response = await axios.post(`${BASE_URL}/api/chat`, { message });
  return response.data.reply;
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
