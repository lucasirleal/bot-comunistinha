import { Message, TextChannel } from 'discord.js';
import { Bot } from '../classes/Bot';
import { CommandBinder } from '../interfaces/CommandBinder';

export const name = 'queue';

export const description = 'O comando que mostra a fila atual do bot.';

export const action: CommandBinder = async (bot: Bot, message: Message) => {
  bot.queue().logger.logCurrentQueue(message.channel as TextChannel);
};
