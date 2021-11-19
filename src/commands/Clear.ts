import { Message } from 'discord.js';
import { Bot } from '../classes/Bot';
import { CommandBinder } from '../interfaces/CommandBinder';

export const name = 'clear';

export const description = 'O comando que limpa a fila atual do bot.';

export const action: CommandBinder = async (bot: Bot, message: Message) => {
  bot.queue().clearQueue();
  message.react('🗑️');
};
