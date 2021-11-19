import { Message, TextChannel, VoiceChannel } from 'discord.js';
import { Bot } from '../classes/Bot';
import { QueueLinkParser } from '../classes/Queue/QueueLinkParser';
import { CommandBinder } from '../interfaces/CommandBinder';

export const name = 'play';

export const description = 'O comando inicial para a fila musical.';

export const action: CommandBinder = async (bot: Bot, message: Message, args: string[]) => {
  const channel = await message.member?.voice.channel?.fetch();

  const fullSentence = args.join(' ');

  if (fullSentence.replace(/\s/g, '').length === 0) {
    // Checa se o usuário está apenas tentando resumir a fila que foi parada.
    if (bot.queue().getQueue().length > 0 && bot.queue().connector.isConnectedToVoice() && !bot.queue().connector.isPlaying()) {
      return bot.queue().connector.startPlayingQueue();
    }
    return bot.defaultEmbedHandler().sendMissingPlayArgsEmbed(message);
  }

  if (!channel) return bot.defaultEmbedHandler().sendMissingConnectionEmbed(message);

  if (!bot.queue().connector.isConnectedToVoice() || !bot.queue().connector.isConnectedToSpecificChannel(channel.id)) {
    await bot.queue().connector.tryConnection(message.member?.voice.channel as VoiceChannel, true);
  }

  const youTubeSingleVideoMatch = QueueLinkParser.getYouTubeVideoLink(fullSentence);
  const youTubePlaylistMatch = QueueLinkParser.getYouTubePlaylistLink(fullSentence);
  const spotifyTrackMatch = QueueLinkParser.getSpotifyTrackLink(fullSentence);
  const spotifyPlaylistMatch = QueueLinkParser.getSpotifyPlaylistLink(fullSentence);

  if (youTubeSingleVideoMatch != null) {
    try {
      const songTitle = await bot.queue().addSingleYouTubeToQueue(youTubeSingleVideoMatch);
      return bot.defaultEmbedHandler().sendSongAddedToQueue(message.channel as TextChannel, songTitle);
    } catch (error) {
      return console.log(`🔴 Ocorreu um erro na fila musical: ${error}`);
    }
  }

  if (youTubePlaylistMatch != null) {
    try {
      const songs = await bot.queue().addYouTubePlaylistToQueue(youTubePlaylistMatch);
      return bot.defaultEmbedHandler().sendPlaylistAddedToQueue(message.channel as TextChannel, songs);
    } catch (error) {
      return console.log(`🔴 Ocorreu um erro na fila musical: ${error}`);
    }
  }

  if (spotifyTrackMatch != null) {
    try {
      const song = await bot.queue().addSpotifyTrackToQueue(spotifyTrackMatch);
      return bot.defaultEmbedHandler().sendSongAddedToQueue(message.channel as TextChannel, song);
    } catch (error) {
      return console.log(`🔴 Ocorreu um erro na fila musical: ${error}`);
    }
  }

  if (spotifyPlaylistMatch != null) {
    try {
      const songs = await bot.queue().addSpotifyPlaylistToQueue(spotifyPlaylistMatch);
      return bot.defaultEmbedHandler().sendPlaylistAddedToQueue(message.channel as TextChannel, songs);
    } catch (error) {
      return console.log(`🔴 Ocorreu um erro na fila musical: ${error}`);
    }
  }

  const song = await bot.queue().addFromSearchString(fullSentence);
  bot.defaultEmbedHandler().sendSongAddedToQueue(message.channel as TextChannel, song);
};
