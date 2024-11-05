const PuppeteerService = require('../../services/puppeteerService');
const LoginService = require('../../services/loginService');
const { googleCredentials } = require('../../../config');

class PerplexityController {
  static async search(req, res) {
    console.log('Searching...');
    const { query } = req.body;
    const puppeteerService = new PuppeteerService();
    await puppeteerService.initBrowser();
    try {
      await puppeteerService.goToUrl('https://www.perplexity.ai');
      const loginService = new LoginService(puppeteerService.page);

      // Authenticate if needed
      await loginService.performGoogleLogin(googleCredentials.email, googleCredentials.password);

      // Perform search and collect results
      const answerDetails = await puppeteerService.performSearch(query);

      res.json(answerDetails);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    } finally {
      await puppeteerService.closeBrowser();
    }
  }
}

module.exports = PerplexityController;
