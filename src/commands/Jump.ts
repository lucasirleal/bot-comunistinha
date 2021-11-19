import { Message, TextChannel } from 'discord.js';
import { Bot } from '../classes/Bot';
import { CommandBinder } from '../interfaces/CommandBinder';

export const name = 'jump';

export const description = 'O comando que pula para uma música específica na fila.';

export const action: CommandBinder = async (bot: Bot, message: Message, args: string[]) => {
  if (!bot.queue().connector.isConnectedToVoice()) return bot.defaultEmbedHandler().sendNoQueueError(message.channel as TextChannel);
  if (!args.length) return bot.defaultEmbedHandler().sendMissingJumpArgs(message.channel as TextChannel);

  const number = Math.abs(parseInt(args[0])) - 1;

  if (isNaN(number)) return bot.defaultEmbedHandler().sendMissingJumpArgs(message.channel as TextChannel);
  if (bot.queue().getQueue().length <= number || number <= 0) return bot.defaultEmbedHandler().sendNoMusicIndexError(message.channel as TextChannel);

  bot.queue().setCurrentSongIndex(number);
  bot.queue().connector.startPlayingQueue(true, message.channel as TextChannel);
};
