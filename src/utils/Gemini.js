const SendToGemini = async (text) => {
  console.log(`Sending to Gemini... ${text}`)
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
                  "text": `how are youu geminiii`
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