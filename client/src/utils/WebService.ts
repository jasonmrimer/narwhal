import { GreetingModel } from '../greeting/GreetingModel';

export interface WebService {
  get(url: string): Promise<GreetingModel>;
}

class WebServiceImpl implements WebService {
  get(url: string) {
    return fetch(url).then(response => response.json());
  }
}

export default new WebServiceImpl();
