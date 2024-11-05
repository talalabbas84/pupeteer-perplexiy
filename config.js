module.exports = {
  googleCredentials: {
    email: 'talaljafri720@gmail.com',
    password: 'Testoo123!',
  },
  puppeteerConfig: {
    headless: true,
    product: 'chrome', // Use 'firefox' only if necessary
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process,AutomationControlled',
      '--disable-infobars',
      '--window-size=1920,1080',
      '--hide-scrollbars',
      '--mute-audio',
      '--incognito', // Run in incognito mode to minimize traceability
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    ],
    defaultViewport: null, // Disables setting a viewport so it uses default
    userDataDir: './user_data',
  },
};
