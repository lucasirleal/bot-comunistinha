import { Bot } from './Bot';
import { GuildMember, HexColorString, MessageEmbed, TextBasedChannels } from 'discord.js';
import { TemplateString } from '../interfaces/TemplateString';
import * as ptbr from '../data/messages/pt-br/messages.json';

export class DefaultEmbedHandler {
  private clientInstance: Bot;

  public constructor(client: Bot) {
    this.clientInstance = client;
  }

  public sendCommandNotFound(channel: TextBasedChannels) {
    const embed = this.generateEmbed();
    embed.setDescription(ptbr.commandNotFound);

    channel.send({ embeds: [embed] });
  }

  public generateEmbed(): MessageEmbed {
    const color = this.clientInstance.configs().getEmbedColor() as HexColorString;
    return new MessageEmbed().setColor(color);
  }

  public setAuthor(embed: MessageEmbed, customAuthor?: GuildMember): MessageEmbed {
    const author = customAuthor ? customAuthor.user.username : (this.clientInstance.user?.username as string);
    const avatar = customAuthor ? customAuthor.displayAvatarURL() : this.clientInstance.user?.displayAvatarURL();

    return embed.setFooter(author, avatar);
  }

  public getMessages() {
    return ptbr;
  }

  public applyTemplateStrings(message: string, templates: TemplateString[]): string {
    templates.forEach((template) => {
      message = message.replaceAll(template.template, template.content);
    });
    return message;
  }
}
