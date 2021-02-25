import { browser, promise } from 'protractor';

export class AppPage {
  public async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  public getTitle(): promise.Promise<string> {
    return browser.getTitle();
  }

  public getUrl(): promise.Promise<string> {
    return browser.getCurrentUrl();
  }
}
