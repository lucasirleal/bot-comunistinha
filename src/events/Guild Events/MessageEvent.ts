import { Message, TextChannel } from 'discord.js';
import { Bot } from '../../classes/Bot';
import { EventBinder } from '../../interfaces/EventBinder';

export const name = 'message';
export const run: EventBinder = async (bot: Bot, message: Message) => {
  if (!validateCommand(bot, message)) return;

  const preparedMessage = firstPrepareMessage(message.content);
  const allArgs = preparedMessage.split(' ');

  const firstArg = allArgs.shift() as string;

  if (!bot.commander().isValidCommand(firstArg)) {
    return bot.defaultEmbedHandler().sendCommandNotFound(message.channel as TextChannel);
  }

  bot.commander().getCommand(firstArg)?.action(bot, message, allArgs);
};

const validateCommand = (bot: Bot, message: Message): boolean => {
  return message.content.trim().startsWith(bot.configs().getPrefix()) && !message.author.bot;
};

const firstPrepareMessage = (message: string): string => {
  return message.trim().substr(1);
};
