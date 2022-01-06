import { Message, TextChannel, VoiceChannel } from 'discord.js';
import { Bot } from '../classes/Bot';
import { QueueLinkParser } from '../classes/Queue/QueueLinkParser';
import { CommandBinder } from '../interfaces/CommandBinder';

export const name = 'replay';

export const description = 'Faz com que o bot toque a fila musical começando do zero.';

export const action: CommandBinder = async (bot: Bot, message: Message) => {
  const channel = await message.member?.voice.channel?.fetch();

  if (!channel) return bot.defaultEmbedHandler().sendMissingConnectionEmbed(message);

  if (!bot.queue().connector.isConnectedToVoice() || !bot.queue().connector.isConnectedToSpecificChannel(channel.id)) {
    await bot.queue().connector.tryConnection(message.member?.voice.channel as VoiceChannel, true);
  }

  if (bot.queue().getQueue().length === 0) {
    return await bot.defaultEmbedHandler().sendNoQueueError(message.channel as TextChannel);
  }

  bot.queue().setCurrentSongIndex(0);
  bot.queue().connector.startPlayingQueue(true);

  message.react('🔁');
};
