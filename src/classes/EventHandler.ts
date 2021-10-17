import glob from 'glob';
import { promisify } from 'util';
import { Collection } from 'discord.js';
import path from 'path';
import { Event } from '../interfaces/Event';
import { Bot } from './Bot';

const globPromise = promisify(glob);

export class EventHandler {
  private clientInstance: Bot;
  private events: Collection<string, Event> = new Collection();

  public constructor(client: Bot) {
    this.clientInstance = client;
    this.prepareEvents();
  }

  private async prepareEvents() {
    const files = await this.loadAllFiles();
    this.bindAllFilesToEvents(files);
  }

  private bindAllFilesToEvents(files: string[]) {
    files.forEach(async (file) => {
      const fileContent: Event = await require(file);
      this.events.set(fileContent.name, fileContent);
      this.registerEventListener(fileContent);
      this.logEventStatus(fileContent.name);
    });
  }

  private registerEventListener(event: Event) {
    this.clientInstance.on(event.name, event.run.bind(null, this.clientInstance));
  }

  private logEventStatus(commandName: string) {
    console.log(`🔵 Carregado o evento [${commandName}] com sucesso.`);
  }

  private loadAllFiles(): Promise<string[]> {
    return globPromise(path.join(__dirname, `/../events/**/*{.ts,.js}`));
  }
}
