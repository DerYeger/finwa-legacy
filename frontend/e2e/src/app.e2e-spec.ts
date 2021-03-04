import { browser, logging } from 'protractor';

// eslint-disable-next-line no-restricted-imports
import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should have the correct title', async () => {
    await page.navigateTo();
    expect(await page.getTitle()).toEqual('FinWa');
  });

  it('should navigate to setup', async () => {
    await page.navigateTo();
    const url: string = await page.getUrl();
    expect(url.endsWith('/setup')).toBeTruthy();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
