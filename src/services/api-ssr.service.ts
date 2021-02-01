import { DatabusService } from '@reactblog/node/services/abstracts/databus.service';
import { Container } from '@reactblog/core/container';

export class ApiSsrService {

  private readonly databusService: DatabusService = Container.getContext().get(DatabusService);

  get (url: string, query: any = {}) {
    return this.request('GET', url, { query });
  }

  private async request (method: string, url: string, options: any = {}) {
    const serviceName = `${url.split('/')[1].toUpperCase()}-SERVICE`;
    console.log('====================>');
    console.log('serviceName', serviceName);
    const response = await this.databusService.send(
      serviceName,
      `${method} /api${url}`,
      { query: options.query },
    );

    return response.body;
  }
}
