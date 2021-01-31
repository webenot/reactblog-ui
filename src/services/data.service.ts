import { matchRoutes, RouteConfig } from 'react-router-config';

import { Injectable, resolve } from '@reactblog/core/annotations';
import { CONTAINER_CONTEXT } from '@reactblog/core/container';
import { LocationService } from './location.service';

@Injectable
export class DataService {

  @resolve
  private readonly locationService: LocationService;

  async load (pages: RouteConfig[]) {
    const routes = matchRoutes(pages, this.locationService.pathname);
    let promises: any[] = [];

    const { route } = routes.pop();

    const load = Reflect.getMetadata('load', route.component) || [];
    const metadata = Reflect.getMetadata('resolve', route.component) || [];

    const context = {};
    // @ts-ignore
    const container = this[CONTAINER_CONTEXT];

    metadata
      .forEach(([ name, target ]: any) => {
        Object.defineProperty(context, name, {
          get () {
            return container.get(target);
          },
        });
      });

    promises = promises.concat(
      load
        .filter(([ type ]: any) => {
          // @ts-ignore
          const currentTarget = global.IS_BROWSER ? 'BROWSER' : 'SERVER';
          return type === 'ALL' || currentTarget === type;
        })
        .map(([ , fn ]: any) => fn.call(context)),
    );

    return Promise.all(promises);
  }

  listen (pages: RouteConfig[]) {
    this.load(pages);
    this.locationService.history.listen(() => {
      this.load(pages);
    });
  }
}
