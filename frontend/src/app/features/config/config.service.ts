import { Injectable } from '@angular/core';
import {Config} from './config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  #config!: Config;

  constructor() { }

  get config(): Config {
    return this.#config;
  }

  set config(data) {
    this.#config = data;
  }

  async loadConfig() {
    return await fetch('assets/config/config.json').then(
      (response) => response.json()
    );
  }
}
