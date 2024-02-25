import axios from 'axios';

const analyzeImageWithOpenAI = async (imageBase64, description) => {
  const API_KEY = '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'; // Highly insecure, just for demonstration
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  };

  const body = {
    model: "gpt-4-vision-preview", // Ensure you use the correct model for your use case
    messages: [
      {
        role: "user",
        content: description
      },
      {
        role: "system",
        content: imageBase64 // This needs to be a base64-encoded image string
      }
    ],
    max_tokens: 300
  };

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', body, { headers });
    return response.data;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return null;
  }
};
