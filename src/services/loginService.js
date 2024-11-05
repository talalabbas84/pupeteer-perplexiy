class LoginService {
  constructor(page) {
    this.page = page;
  }

  async performGoogleLogin(email, password) {
    try {
      // Click "Continue with Google" button
      const googleButtonSelector = 'button';
      const buttonClicked = await this.page.evaluate((selector) => {
        const buttons = Array.from(document.querySelectorAll(selector));
        const googleButton = buttons.find(button => button.innerText.includes("Continue with Google"));
        if (googleButton) {
          googleButton.click();
          return true;
        }
        return false;
      }, googleButtonSelector);

      if (!buttonClicked) {
        console.log("Could not find 'Continue with Google' button.");
        return;
      }

      console.log("Clicked on 'Continue with Google' button.");
      await this.delay(2000); // Use custom delay

      // Enter email
      await this.page.waitForSelector('input#identifierId', { visible: true });
      await this.page.type('input#identifierId', email);
      await this.page.screenshot({ path: 'email-entered.png', fullPage: true });
      console.log("Screenshot saved: 'email-entered.png'");

      // Click Next after entering email
      await this.page.click('#identifierNext');
      await this.delay(3000);

      // Enter password
      await this.page.waitForSelector('input[type="password"]', { visible: true });
      await this.page.type('input[type="password"]', password);
      await this.page.screenshot({ path: 'password-entered.png', fullPage: true });
      console.log("Screenshot saved: 'password-entered.png'");

      // Click Next after entering password
      await this.page.click('#passwordNext');
      console.log("Login process completed.");
      await this.delay(5000);

      await this.page.screenshot({ path: 'login-complete.png', fullPage: true });
      console.log("Screenshot saved: 'login-complete.png'");
    } catch (error) {
      console.error("An error occurred during Google login:", error);
    }
  }

  // Custom delay function
  delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
}

module.exports = LoginService;
