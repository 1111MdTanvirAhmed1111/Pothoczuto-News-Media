const axios = require('axios');

const SendToGemini = async (text) => {
  console.log(`Sending to Gemini... ${text}`)
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text:  text
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    throw error;
  }
}

module.exports = {
    SendToGemini
}