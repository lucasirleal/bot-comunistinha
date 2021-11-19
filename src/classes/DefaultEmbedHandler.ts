import { Bot } from './Bot';
import { ColorResolvable, GuildMember, Message, MessageEmbed, TextChannel } from 'discord.js';
import { TemplateString } from '../interfaces/TemplateString';
import * as ptbr from '../data/messages/pt-br/messages.json';
import { Helper } from './Helper';

export class DefaultEmbedHandler {
  private clientInstance: Bot;

  public constructor(client: Bot) {
    this.clientInstance = client;
  }

  public async sendPlayingNow(channel: TextChannel, song: string) {
    const embed = this.generateEmbed();
    const text = this.applyTemplateStrings(ptbr.playingNow, [{ template: '%SONG%', content: Helper.clampString(song) }]);
    embed.setDescription(text);

    const sent = await channel.send(embed);
    this.destroyMessage(sent, 60000);
  }

  public sendMissingJumpArgs(channel: TextChannel) {
    const embed = this.generateEmbed();
    embed.setDescription(ptbr.missingJumpArgs);

    channel.send(embed);
  }

  public sendNoQueueError(channel: TextChannel) {
    const embed = this.generateEmbed();
    embed.setDescription(ptbr.noQueue);

    channel.send(embed);
  }

  public sendNoMusicIndexError(channel: TextChannel) {
    const embed = this.generateEmbed();
    embed.setDescription(ptbr.noQueuePosition);

    channel.send(embed);
  }

  public sendCommandNotFound(channel: TextChannel) {
    const embed = this.generateEmbed();
    embed.setDescription(ptbr.commandNotFound);

    channel.send(embed);
  }

  public sendMissingConnectionEmbed(message: Message) {
    const embed = this.generateEmbed();
    embed.setDescription(ptbr.missingVoiceConnection);
    message.reply(embed);
  }

  public sendMissingPlayArgsEmbed(message: Message) {
    const embed = this.generateEmbed();
    embed.setDescription(ptbr.missingPlayArgs);
    message.reply(embed);
  }

  public async sendSongAddedToQueue(channel: TextChannel, song: string) {
    const embed = this.generateEmbed();
    const text = this.applyTemplateStrings(ptbr.songAddedToQueue, [{ template: '%SONG%', content: Helper.clampString(song) }]);
    embed.setDescription(text);

    const sent = await channel.send(embed);
    this.destroyMessage(sent, 60000);
  }

  public async sendPlaylistAddedToQueue(channel: TextChannel, songs: string[]) {
    const embed = this.generateEmbed();

    let fullList = `\n\n`;
    songs.forEach((song) => (fullList += `🔸 ${Helper.clampString(song)}\n`));

    const text = this.applyTemplateStrings(ptbr.songAddedToQueue, [{ template: '%SONG%', content: fullList }]);
    embed.setDescription(text);

    const sent = await channel.send(embed);
    this.destroyMessage(sent, 60000);
  }

  public generateEmbed(): MessageEmbed {
    const color = this.clientInstance.configs().getEmbedColor() as ColorResolvable;
    return new MessageEmbed().setColor(color);
  }

  public setAuthor(embed: MessageEmbed, customAuthor?: GuildMember): MessageEmbed {
    const author = customAuthor ? customAuthor.user.username : (this.clientInstance.user?.username as string);
    const avatar = customAuthor ? customAuthor.user.displayAvatarURL() : this.clientInstance.user?.displayAvatarURL();

    return embed.setFooter(author, avatar);
  }

  public getMessages() {
    return ptbr;
  }

  public applyTemplateStrings(message: string, templates: TemplateString[]): string {
    templates.forEach((template) => {
      message = message.replace(new RegExp(template.template, 'g'), template.content);
    });
    return message;
  }

  private destroyMessage(message: Message, timer: number) {
    setTimeout(() => {
      message.delete();
    }, timer);
  }
}
