import { Message } from 'discord.js';
import { Bot } from '../classes/Bot';
import { CommandBinder } from '../interfaces/CommandBinder';

export const name = 'ping';

export const description = 'Um comando de ping básico.';

export const action: CommandBinder = async (bot: Bot, message: Message) => {
  const sentTime = message.createdTimestamp;
  const timeElapsed = ((new Date().getTime() - sentTime) * -1) / 1000;

  let embed = bot.defaultEmbedHandler().generateEmbed();
  embed = bot.defaultEmbedHandler().setAuthor(embed);

  const embedText = bot.defaultEmbedHandler().getMessages().pingMessage;
  const parsedEmbedText = bot.defaultEmbedHandler().applyTemplateStrings(embedText, [{ template: '%TIME%', content: timeElapsed.toString() }]);

  embed.setDescription(parsedEmbedText);
  message.channel.send(embed);
};
