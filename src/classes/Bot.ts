import { Client, Intents } from 'discord.js';
import { CommandHandler } from './CommandHandler';
import { ConfigHandler } from './ConfigHandler';
import { DefaultEmbedHandler } from './DefaultEmbedHandler';
import { EventHandler } from './EventHandler';
import { Queue } from './Queue/Queue';

export class Bot extends Client {
  private commandHandler: CommandHandler = new CommandHandler();
  private eventHandler: EventHandler = new EventHandler(this);
  private configHandler: ConfigHandler = new ConfigHandler();
  private defaultEmbeds: DefaultEmbedHandler = new DefaultEmbedHandler(this);
  private queueHandler: Queue = new Queue(this);

  public constructor() {
    super({
      ws: {
        intents: [
          Intents.FLAGS.GUILD_MESSAGES,
          Intents.FLAGS.GUILD_MEMBERS,
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_VOICE_STATES,
          Intents.FLAGS.GUILD_INTEGRATIONS,
        ],
      },
    });
  }

  public configs(): ConfigHandler {
    return this.configHandler;
  }

  public commander(): CommandHandler {
    return this.commandHandler;
  }

  public defaultEmbedHandler(): DefaultEmbedHandler {
    return this.defaultEmbeds;
  }

  public queue(): Queue {
    return this.queueHandler;
  }

  public logOn(): Promise<string> {
    return this.login(process.env.BOT_TOKEN);
  }
}
