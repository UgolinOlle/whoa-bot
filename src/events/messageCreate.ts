import { ChannelType, Message } from 'discord.js';

import Event from '../core/structures/Event';
import Whoa from '../core/structures/Whoa';
import CommandHandler from '../core/classes/CommandHandler';
import Logger from '../core/classes/Logger';

export default class MessageCreateEvent extends Event {
  constructor(client: Whoa) {
    super(client, 'messageCreate');
  }

  async run(message: Message): Promise<any> {
    if (message.author.bot || message.channel.type === ChannelType.DM) return;
    Logger.log(
      'DEBUG',
      `[MESSAGE] ${message.author.tag} (${message.author.id}) sent a message in ${message.guild?.name} (${message.guild?.id})`,
    );
    return CommandHandler.handleCommand(this.client, message);
  }
}
