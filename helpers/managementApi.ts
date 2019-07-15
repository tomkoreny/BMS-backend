import * as flashheart from 'flashheart';

export class ManagementApi {
  baseUrl: string;
  client: flashheart.RestClient;
  options: any;
  constructor(url: string, client: flashheart.RestClient, options: any) {
    this.baseUrl = url;
    this.client = client;
    this.options = options
  }
  async get (url: string) {
    return await this.client.get(this.baseUrl + url, this.options); 
  }
  async delete (url: string) {
    return await this.client.get(this.baseUrl + url, this.options); 
  }
  async patch (url: string, body: any) {
    return await this.client.patch(this.baseUrl + url, body, this.options); 
  }
  async post (url: string, body: any) {
    return await this.client.post(this.baseUrl + url, body, this.options); 
  }
}
