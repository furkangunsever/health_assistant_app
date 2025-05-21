import {API_CONFIG} from '../config/api';

interface AIResponse {
  etiket: string;
  yanit: string;
}

export const sendMessageToAI = async (userId: string, message: string): Promise<AIResponse> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AI_RESPONSE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kullanici_id: userId,
        soru: message,
      }),
    });

    if (!response.ok) {
      throw new Error('API yanıt vermedi');
    }

    const data: AIResponse = await response.json();
    return data;
  } catch (error) {
    console.error('AI servisi hatası:', error);
    throw error;
  }
}; 