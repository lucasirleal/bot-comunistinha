import { StreamDispatcher, TextChannel, VoiceChannel, VoiceConnection } from 'discord.js';
import { Queue } from './Queue';
import ytdl from 'ytdl-core';

export class QueueConnectionHandler {
  private queue: Queue;
  private connection: VoiceConnection | undefined;
  private currentDispatcher: StreamDispatcher | undefined;

  public constructor(queue: Queue) {
    this.queue = queue;
  }

  public isConnectedToVoice(): boolean {
    return !!this.connection;
  }

  public isConnectedToSpecificChannel(channelId: string): boolean {
    return channelId === this.connection?.channel.id;
  }

  public isPlaying(): boolean {
    return !!this.currentDispatcher;
  }

  public async tryConnection(voiceChannel: VoiceChannel, forceReset = false): Promise<boolean> {
    if (!forceReset && this.connection) return true;
    if (forceReset && this.connection?.channel.id === voiceChannel.id) return true;

    try {
      this.connection = await voiceChannel.join();
      return true;
    } catch (error) {
      console.error(`🔴 Erro ao conectar à um chat de voz: ${error}.`);
      return false;
    }
  }

  public startPlayingQueue(force = false, channelToLogChanges: TextChannel | undefined = undefined) {
    if (!this.isConnectedToVoice) return;
    if (this.currentDispatcher) {
      if (!force) return;
      this.currentDispatcher.destroy();
    }

    const song = this.queue.getQueue()[this.queue.getCurrentSongIndex()];
    if (!song) return;

    try {
      if (channelToLogChanges) {
        this.queue.logger.logSongPlaying(song, channelToLogChanges);
      }
      this.currentDispatcher = this.connection?.play(ytdl(song.url, { filter: 'audioonly' }));
      this.bindDispatcherListeners(this.currentDispatcher as StreamDispatcher);
    } catch (error) {
      console.log(`🟠 Erro durante a execução da música ${song}: ${error}`);
      this.moveQueueFoward();
    }
  }

  public stopPlaying() {
    if (!this.isConnectedToVoice()) return;
    this.currentDispatcher?.destroy();
    this.currentDispatcher = undefined;
  }

  private bindDispatcherListeners(dispatcher: StreamDispatcher) {
    dispatcher.on('error', (error) => console.log(`🟠 Erro ao tocar música: ${error}.`));
    dispatcher.on('finish', () => this.moveQueueFoward());
  }

  private moveQueueFoward() {
    const nextIndex = this.queue.getCurrentSongIndex() + 1;

    if (nextIndex >= this.queue.getQueue().length) {
      return this.queue.setCurrentSongIndex(0);
    }

    this.queue.setCurrentSongIndex(nextIndex);
    this.startPlayingQueue(true);
  }
}
