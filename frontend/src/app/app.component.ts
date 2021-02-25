import { Component, OnDestroy, OnInit } from '@angular/core';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import { Subscription } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Language, State } from './store/state';
import * as d3 from 'd3';
import { TranslateService } from '@ngx-translate/core';
import { setLanguage } from './store/actions';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'finwa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  private readonly languages = {
    de: localeDe,
    en: localeEn,
  };

  private languageSubscription?: Subscription;
  private themeSubscription?: Subscription;

  public constructor(private readonly store: Store<State>, private readonly translate: TranslateService, private readonly log: NGXLogger) {
    Object.entries(this.languages).forEach(([language, locale]) => {
      translate.setTranslation(language, require(`../assets/i18n/${language}.json`));
      registerLocaleData(locale);
      log.debug(`Language ${language} registered.`);
    });
  }

  /**
   * Subscribes to setting-changes.
   */
  public ngOnInit(): void {
    this.languageSubscription = this.store
      .select('settings')
      .pipe(
        map((settings) => settings.language),
        distinctUntilChanged()
      )
      .subscribe((language) => {
        if (language === undefined) {
          const browserLanguage = this.translate.getBrowserLang() as Language;
          const initialLanguage = browserLanguage === 'en' || browserLanguage === 'de' ? browserLanguage : 'en';
          this.store.dispatch(setLanguage({ language: initialLanguage }));
        } else {
          this.log.info(`Set ${language} as current language.`);
          this.translate.use(language);
        }
      });

    this.themeSubscription = this.store
      .select('settings')
      .pipe(
        map((settings) => settings.theme),
        distinctUntilChanged()
      )
      .subscribe((theme) => {
        this.log.info(`Set ${theme} as current theme.`);
        d3.select(document.body)
          .classed('dark-theme', 'dark-theme' === theme)
          .classed('light-theme', 'light-theme' === theme);
      });
  }

  /**
   * Unsubscribes from setting-changes.
   */
  public ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
    this.themeSubscription?.unsubscribe();
    this.log.debug(`Subscriptions destroyed.`);
  }
}
