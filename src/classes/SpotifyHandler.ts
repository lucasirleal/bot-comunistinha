import Spotify from '../externals/spotify';
import { YouTubeHandler } from './YouTubeHandler';
import { Song } from '../interfaces/Song';

export class SpotifyHandler {
  private spotify = new Spotify({
    clientID: process.env.BOT_SPOTIFY_CLIENTID as string,
    clientSecret: process.env.BOT_SPOTIFY_CLIENTSECRET as string,
  });

  private ytSearch = new YouTubeHandler();

  public async getSong(videoId: string): Promise<Song> {
    const data = await this.spotify.getTrack(videoId);
    return this.ytSearch.getSongFromQuery(data);
  }

  public async getPlaylist(playlistId: string): Promise<Song[]> {
    const data = await this.spotify.getPlaylist(playlistId);
    if (!data.length) throw new Error(`Sem resultados do Spotify [Playlist]. ID: ${playlistId}.`);

    const returnSongs: Song[] = [];

    await Promise.all(
      data.map(async (query) => {
        const ytData = await this.ytSearch.getSongFromQuery(query);
        returnSongs.push(ytData);
      })
    );

    return returnSongs;
  }
}
