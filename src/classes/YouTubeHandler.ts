import ytdl, { MoreVideoDetails } from 'ytdl-core';
import ytpl, { Item } from 'ytpl';
import { Song } from '../interfaces/Song';
import axios from 'axios';

export class YouTubeHandler {
  public async getSong(videoId: string): Promise<Song> {
    const data = await ytdl.getBasicInfo(videoId);
    return this.buildSong(data.videoDetails);
  }

  public async getPlaylist(playlistId: string): Promise<Song[]> {
    const data = await ytpl(playlistId);
    return this.buildSongsFromPlaylist(data.items);
  }

  public async getSongFromQuery(query: string): Promise<Song | undefined> {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURI(query)}&type=video&key=${process.env.BOT_YOUTUBE_TOKEN}&videoCategoryId=10`);
      if (!response?.data?.items[0].snippet || !response?.data?.items[0].id) throw new Error(`Sem resultados no YouTube para a query [${query}]`);
      const item = response.data.items[0];
      return {
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        title: item.snippet.title,
        videoId: item.id.videoId,
      };
    } catch (error) {
      throw error;
    }
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
