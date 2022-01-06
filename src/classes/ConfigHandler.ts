import path from 'path';
import { Config } from '../interfaces/Config';
import * as ConfigFile from '../data/config.json';

export class ConfigHandler {
  private config: Config = ConfigFile as Config;

  public async reloadConfig() {
    this.config = await require(path.join(__dirname, '/../data/config.json'));
  }

  public getPrefix(): string {
    return this.config.prefix;
  }

  public getEmbedColor(): string {
    return this.config.embed_color;
  }
}
