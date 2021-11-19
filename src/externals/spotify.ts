'use strict';
import request from 'request-promise';
import { Base64 } from 'js-base64';

/*
    Olá caro viajante dos códigos! 😁🖐️
    O código a seguir não pertence à minha pessoa.
    Eu não detenho nenhum direito sobre ela, e nem pretendo deter.
    O código a seguir é uma simples adaptação ao TypeScript do código presente neste módulo do node:
    -> https://npm.io/package/spotify-info.js

    Algumas funções do pacote foram removidas pois não eram necessárias.
    O resto apenas foi convertido para um formato aceito pelo TS.
*/

export interface Credentials {
  clientID: string;
  clientSecret: string;
}

export interface AuthOptions {
  url: string;
  headers: { Authorization: string };
  form: { grant_type: string };
  json: boolean;
}

export interface TrackWrapper {
  track: { name: string; artists: Array<{ name: string }> };
}

export default class Spotify {
  private details: Credentials;
  private authOptions: AuthOptions;

  constructor(details: Credentials) {
    this.details = details;
    this.authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: `Basic ${Base64.encode(this.details.clientID + ':' + this.details.clientSecret)}`,
      },
      form: {
        grant_type: 'client_credentials',
      },
      json: true,
    };
  }

  public async getTrack(trackID: string): Promise<string> {
    return new Promise((resolve) => {
      request.post(this.authOptions, async (error, response, body) => {
        if (error) throw error;

        const trackRequestData = {
          url: `https://api.spotify.com/v1/tracks/${trackID}`,
          headers: {
            Authorization: 'Bearer ' + body.access_token,
          },
          json: true,
        };

        request.get(trackRequestData, (error, response, body) => {
          if (error) throw error;
          resolve(body.name + ' - ' + body.artists[0].name);
        });
      });
    });
  }

  public async getPlaylist(playListID: string): Promise<string[]> {
    return new Promise((resolve) => {
      request.post(this.authOptions, async (error, response, body) => {
        if (error) throw error;

        const trackRequestData = {
          url: `https://api.spotify.com/v1/playlists/${playListID}`,
          headers: {
            Authorization: 'Bearer ' + body.access_token,
          },
          json: true,
        };

        request.get(trackRequestData, (error, response, body) => {
          if (error) throw error;
          const returnArray: string[] = [];
          body.tracks.items.forEach((trackWrapper: TrackWrapper) => {
            returnArray.push(trackWrapper.track.name + ' - ' + trackWrapper.track.artists[0].name);
          });
          resolve(returnArray);
        });
      });
    });
  }
}
