import { Message } from 'discord.js';
import { Bot } from '../classes/Bot';
import { CommandBinder } from '../interfaces/CommandBinder';

export const name = 'stop';

export const description = 'O comando que para a fila musical.';

export const action: CommandBinder = async (bot: Bot, message: Message) => {
  bot.queue().connector.stopPlaying();
  message.react('❌');
};
