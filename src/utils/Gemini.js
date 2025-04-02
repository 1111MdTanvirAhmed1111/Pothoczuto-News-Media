const SendToGemini = async (text) => {
  console.log(`Sending to Gemini... ${text}`)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify({
          "contents": [
            {
              "parts": [
                {
                  "text": `Heyy!! summerize the blog in short and crisp. Here is the blog: ${text}`
                }
              ]
            }
          ]
        })
      })
      const gemini = await response.json()
      return gemini
}

module.exports = {
    SendToGemini
}