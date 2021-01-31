import { Injectable } from '@reactblog/core/annotations';

@Injectable
export class ApiService {

  async get (url: string) {
    console.log(url);
    return 'hi';
  }
}
