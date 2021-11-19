import { Message } from 'discord.js';
import { Bot } from '../classes/Bot';

export interface CommandBinder {
  (bot: Bot, message: Message, args: string[]): Promise<void>;
}
