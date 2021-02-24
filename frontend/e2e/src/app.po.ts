import { browser, by, element } from 'protractor';

export class AppPage {
  public async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  public async getTitleText(): Promise<string> {
    return element(by.css('finwa-root .content span')).getText();
  }
}
