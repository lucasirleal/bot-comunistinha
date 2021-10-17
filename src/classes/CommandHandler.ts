import glob from 'glob';
import path from 'path';
import { Command } from '../interfaces/Command';
import { promisify } from 'util';
import { Collection } from 'discord.js';
import { CommandBinder } from '../interfaces/CommandBinder';

const globPromise = promisify(glob);

export class CommandHandler {
  private commands: Collection<string, Command> = new Collection();

  public constructor() {
    this.prepareCommands();
  }

  private async prepareCommands() {
    const files = await this.loadAllFiles();
    this.bindAllFilesToCommands(files);
  }

  private bindAllFilesToCommands(files: string[]) {
    files.forEach(async (file) => {
      const fileContent: Command = await require(file);
      this.commands.set(fileContent.name.toLowerCase(), fileContent);
      this.logCommandStatus(fileContent.name);
    });
  }

  private logCommandStatus(commandName: string) {
    console.log(`🟣 Carregado o comando [${commandName}] com sucesso.`);
  }

  private loadAllFiles(): Promise<string[]> {
    return globPromise(path.join(__dirname, `/../commands/**/*{.ts,.js}`));
  }

  public isValidCommand(command: string): boolean {
    return this.commands.has(command.toLowerCase());
  }

  public getCommand(command: string): Command | undefined {
    command = command.toLowerCase();
    return this.commands.get(command);
  }
}
