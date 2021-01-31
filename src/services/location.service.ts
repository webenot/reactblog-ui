import { observable } from 'mobx';
import { createBrowserHistory } from 'history';
import qs from 'qs';

import { Injectable } from '@reactblog/core/annotations';

@Injectable
export class LocationService {

  @observable
  public pathname: string;

  @observable
  public query: {
    [key: string]: any;
  } = {};

  private _history: any;

  get history () {
    // @ts-ignore
    if (global.IS_BROWSER) {
      this._history = createBrowserHistory();
    }

    return this._history;
  }

  public handleChangeLocation = (location: any) => {
    this.query = qs.parse(location.search, { ignoreQueryPrefix: true });
    this.pathname = location.pathname;
  };

  go (pathname: string, query: any = {}) {
    this.history.push({
      pathname,
      search: '?' + qs.stringify(query)
    })
  }

  init () {
    // @ts-ignore
    if (global.IS_BROWSER) {
      this.history.listen(this.handleChangeLocation);
      this.handleChangeLocation(this.history.location);
    }
  }

}
