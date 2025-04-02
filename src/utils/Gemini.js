const SendToGemini = async (text) => {
    const response = await fetch(process.env.GEMINI_API_URL, {
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