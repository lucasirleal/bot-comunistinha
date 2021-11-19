import { Message, TextChannel } from 'discord.js';
import { Bot } from '../classes/Bot';
import { CommandBinder } from '../interfaces/CommandBinder';

export const name = 'next';

export const description = 'O comando que pula uma música por vez.';

export const action: CommandBinder = async (bot: Bot, message: Message) => {
  if (!bot.queue().connector.isConnectedToVoice()) return bot.defaultEmbedHandler().sendNoQueueError(message.channel as TextChannel);

  let number = bot.queue().getCurrentSongIndex() + 1;

  // Reseta para zero caso tenhamos chegado ao final da fila.
  if (bot.queue().getQueue().length <= number) number = 0;

  bot.queue().setCurrentSongIndex(number);
  bot.queue().connector.startPlayingQueue(true, message.channel as TextChannel);
};
