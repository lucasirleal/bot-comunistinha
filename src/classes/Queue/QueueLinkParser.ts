export class QueueLinkParser {
  // eslint-disable-next-line
  private static youTubeVideoRegexp = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
  // eslint-disable-next-line
  private static youTubePlaylistRegexp = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/playlist\?list=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

  // eslint-disable-next-line
  private static spotifyTrackRegexp = /^(https:\/\/open.spotify.com\/track\/)([a-zA-Z0-9]+)(.*)$/;
  // eslint-disable-next-line
  private static spotifyPlaylistRegexp = /^(https:\/\/open.spotify.com\/playlist\/|spotify:user:spotify:playlist:)([a-zA-Z0-9]+)(.*)$/;

  public static getYouTubeVideoLink(input: string): string | null {
    const match = input.match(this.youTubeVideoRegexp);
    return match ? match[1] : null;
  }

  public static getYouTubePlaylistLink(input: string): string | null {
    const match = input.match(this.youTubePlaylistRegexp);
    return match ? match[1] : null;
  }

  public static getSpotifyTrackLink(input: string): string | null {
    const match = input.match(this.spotifyTrackRegexp);
    return match ? match[2] : null;
  }

  public static getSpotifyPlaylistLink(input: string): string | null {
    const match = input.match(this.spotifyPlaylistRegexp);
    return match ? match[2] : null;
  }
}
