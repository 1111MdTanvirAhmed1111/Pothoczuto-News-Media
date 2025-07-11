const https = require('https');

const runLooper = () => {


  const url = "https://pothoczuto-news-media.onrender.com";
    const url2= "https://gazi-tanvir-portfolio.onrender.com/blogs"


  const fetcher = async (url) => {
      const res = await fetch(url);
     console.log(res)
    };

  setInterval(async () => {
 
    await fetcher(url);
    await fetcher(url2);
  
    
  }, 45 * 1000);
};

module.exports = {runLooper};
