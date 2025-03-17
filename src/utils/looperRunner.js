const https = require('https');

const runLooper = () => {
  setInterval(() => {
    https.get("https://pothoczuto-news-media.onrender.com");
    https.get("https://gazi-tanvir-portfolio.onrender.com/blogs");
  }, 45 * 1000);
};

module.exports = {runLooper};
