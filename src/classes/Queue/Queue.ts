import { Song } from '../../interfaces/Song';
import { Bot } from '../Bot';
import { YouTubeHandler } from '../YouTubeHandler';
import { QueueLogger } from './QueueLogger';
import { QueueConnectionHandler } from './QueueConnectionHandler';
import { SpotifyHandler } from '../SpotifyHandler';

export class Queue {
  private internalQueue: Song[] = [];
  private currentSongPosition = 0;

  public logger: QueueLogger;
  public connector: QueueConnectionHandler = new QueueConnectionHandler(this);

  private youtube: YouTubeHandler = new YouTubeHandler();
  private spotify: SpotifyHandler = new SpotifyHandler();

  public constructor(bot: Bot) {
    this.logger = new QueueLogger(this, bot);
  }

  public getQueue(): Song[] {
    return this.internalQueue;
  }

  public getCurrentSongIndex(): number {
    return this.currentSongPosition;
  }

  public setCurrentSongIndex(input: number): number {
    this.currentSongPosition = input;
    return this.currentSongPosition;
  }

  public clearQueue() {
    this.connector.stopPlaying();
    this.currentSongPosition = 0;
    this.internalQueue = [];
  }

  public async addSingleYouTubeToQueue(videoId: string): Promise<string> {
    const song = await this.youtube.getSong(videoId);

    this.internalQueue.push(song);
    this.connector.startPlayingQueue();

    return song.title;
  }

  public async addYouTubePlaylistToQueue(playlistId: string): Promise<string[]> {
    const songs = await this.youtube.getPlaylist(playlistId);

    this.internalQueue = this.internalQueue.concat(songs);
    this.connector.startPlayingQueue();

    const titles: string[] = [];
    songs.forEach((song) => titles.push(song.title));

    return titles;
  }

  public async addSpotifyTrackToQueue(trackId: string): Promise<string> {
    const song = await this.spotify.getSong(trackId);

    if (!song) return "";
    
    this.internalQueue.push(song);
    this.connector.startPlayingQueue();

    return song.title;
  }

  public async addSpotifyPlaylistToQueue(playlistId: string): Promise<string[]> {
    const songs = await this.spotify.getPlaylist(playlistId);

    this.internalQueue = this.internalQueue.concat(songs);
    this.connector.startPlayingQueue();

    const titles: string[] = [];
    songs.forEach((song) => titles.push(song.title));

    return titles;
  }

  public async addFromSearchString(search: string): Promise<string> {
    const song = await this.youtube.getSongFromQuery(search);
    if (typeof song === 'undefined') return "";

    this.internalQueue.push(song);
    this.connector.startPlayingQueue();

    return song.title;
  }
}
