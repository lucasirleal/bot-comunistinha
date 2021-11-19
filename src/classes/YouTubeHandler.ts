import ytdl, { MoreVideoDetails } from 'ytdl-core';
import ytpl, { Item } from 'ytpl';
import { Song } from '../interfaces/Song';
import * as youTubeSearch from 'youtube-search-without-api-key';

export class YouTubeHandler {
  public async getSong(videoId: string): Promise<Song> {
    const data = await ytdl.getBasicInfo(videoId);
    return this.buildSong(data.videoDetails);
  }

  public async getPlaylist(playlistId: string): Promise<Song[]> {
    const data = await ytpl(playlistId);
    return this.buildSongsFromPlaylist(data.items);
  }

  public async getSongFromQuery(query: string): Promise<Song> {
    const data = await youTubeSearch.search(query);
    if (!data.length) throw new Error(`Sem resultados no YouTube para a query [${query}]`);

    return {
      url: data[0].url,
      title: data[0].title,
      videoId: data[0].id.videoId,
    };
  }

  private buildSong(details: MoreVideoDetails): Song {
    return {
      title: details.title,
      url: `https://www.youtube.com/watch?v=${details.videoId}`,
      videoId: details.videoId,
    };
  }

  private buildSongsFromPlaylist(items: Item[]): Song[] {
    const returnArray: Song[] = [];

    items.forEach((item) => {
      returnArray.push({ url: item.shortUrl, title: item.title, videoId: item.id });
    });

    return returnArray;
  }
}
