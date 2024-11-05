const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const delay = require('../utils/delay');
const { puppeteerConfig } = require('../../config');

puppeteer.use(StealthPlugin());

class PuppeteerService {
  async initBrowser() {
    this.browser = await puppeteer.launch(puppeteerConfig);
    this.page = await this.browser.newPage();
    this.page.on('console', msg => console.log('PAGE LOG:', msg.text())); // Capture console logs
  }

  async goToUrl(url) {
    await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    await delay(1000, 3000); // Wait for 1-2 seconds after page load
  }

  async closeBrowser() {
    await this.browser.close();
  }

  async performSearch(query) {
    try {
      // Go to Perplexity's homepage
      await this.goToUrl('https://www.perplexity.ai');
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');


      // Array of textarea placeholders to check for the search input
      const textareaPlaceholders = [
        "textarea[placeholder='Search anything...']",
        "textarea[placeholder='Ask anything...']",
        "textarea[placeholder='Type your question here...']",
        "textarea[placeholder='What do you want to know']",
        "textarea[placeholder='You ask, we answer...']",
        "textarea[placeholder='Search the internet...']"
      ];

      let textareaFound = false;
      for (const selector of textareaPlaceholders) {
        try {
          // await this.page.waitForSelector(selector, { visible: true });
          
          await this.page.click(selector);
          await this.page.type(selector, query);
          textareaFound = true;
          console.log(`Query typed into textarea with selector: ${selector}`);
          await this.page.screenshot({ path: 'query-typed.png', fullPage: true });
          console.log("Screenshot saved: 'query-typed.png'");
          break; // Exit loop if textarea is found and query typed
        } catch (error) {
          // If the selector is not found, continue to the next one
          console.error(`Selector not found: ${selector}`, error);
        }
      }

      if (!textareaFound) {
        console.error("Could not locate the textarea.");
        // take screenshot of the page
        await this.page.screenshot({ path: 'textarea-not-found.png', fullPage: true });
        return null; // Exit the method if no textarea was found
      }

      // Click the submit button
      const submitButtonSelector = 'button[aria-label="Submit"]';
      try {
        await this.page.waitForSelector(submitButtonSelector, { visible: true, timeout: 10000 });
        await this.page.click(submitButtonSelector);
        console.log("Clicked on the submit button successfully!");
        await this.page.screenshot({ path: 'after-submit-click.png', fullPage: true });
        console.log("Screenshot saved: 'after-submit-click.png'");
      } catch (error) {
        console.error("Could not locate or click on the submit button:", error);
        return null; // Exit the method if submit button is not found
      }

      await delay(5000); // Wait for results to load

      // Extract sources
      const sources = await this.page.evaluate(() => {
        const sourceElements = Array.from(document.querySelectorAll('a[target="_blank"]'));
        return sourceElements.map(source => ({
          title: source.querySelector('div.line-clamp-3') ? source.querySelector('div.line-clamp-3').innerText : '',
          url: source.href,
          domain: source.querySelector('img') ? source.querySelector('img').alt : '',
          rank: source.querySelector('div.light.font-sans') ? source.querySelector('div.light.font-sans').innerText : ''
        }));
      });

      console.log("Sources found:", sources);
      await this.page.screenshot({ path: 'sources-found.png', fullPage: true });
      console.log("Screenshot saved: 'sources-found.png'");

      // Extract answer text and citations
      const answerDetails = await this.page.evaluate(() => {
        const answerText = Array.from(document.querySelectorAll('div.prose span'))
          .map(span => span.innerText)
          .join(" ");
        const citations = Array.from(document.querySelectorAll('a.citation')).map(citation => ({
          label: citation.getAttribute('aria-label') || 'Unknown source',
          url: citation.href
        }));
        return { answerText, citations };
      });

      console.log("Answer Text:", answerDetails.answerText);
      console.log("Citations:", answerDetails.citations);

      await this.page.screenshot({ path: 'final-answer.png', fullPage: true });
      console.log("Screenshot saved: 'final-answer.png'");

      return { answer: answerDetails.answerText, citations: answerDetails.citations, sources };

    } catch (error) {
      console.error("Error during search process:", error);
      return null; // Return null in case of error
    }
  }

  async delay(min, max=min) {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    await delay(time);
  }



}

module.exports = PuppeteerService;
