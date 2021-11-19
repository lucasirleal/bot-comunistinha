import { TextChannel } from 'discord.js';
import { Song } from '../../interfaces/Song';
import { Bot } from '../Bot';
import { Helper } from '../Helper';
import { Queue } from './Queue';

export class QueueLogger {
  private queue: Queue;
  private bot: Bot;

  public constructor(queue: Queue, bot: Bot) {
    this.queue = queue;
    this.bot = bot;
  }

  public logCurrentQueue(channel: TextChannel) {
    const embed = this.bot.defaultEmbedHandler().generateEmbed();
    this.bot.defaultEmbedHandler().setAuthor(embed);

    if (this.queue.getQueue().length === 0) {
      embed.setDescription('Não há nenhuma música na fila. 🙁');
    } else {
      const currentSong = this.queue.getCurrentSongIndex();
      let fullQueue = `🎶 **Na vitrola comunista:**\n\n`;

      this.queue.getQueue().forEach((song, index) => {
        fullQueue += `${currentSong === index ? '🔹' : '🔸'} \`${(index + 1).toString().padStart(2, '0')}.\` ${Helper.clampString(song.title)}\n`;
      });

      embed.setDescription(fullQueue);
    }

    channel.send(embed);
  }

  public logSongPlaying(song: Song, channel: TextChannel) {
    this.bot.defaultEmbedHandler().sendPlayingNow(channel, song.title);
  }
}
