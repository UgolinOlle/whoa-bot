import { GuildMember, Message } from 'discord.js';

import { ICommand } from '../interfaces/Command';
import Whoa from './Whoa';
import Logger from '../classes/Logger';
import { isDev } from '../utils/common';

/**
 * Abstract Command class serving as a template for all other command classes.
 */
export default abstract class Command {
  /**
   * Reference to the Whoa (Discord client) instance.
   */
  private readonly client: Whoa;

  /**
   * Command-specific information such as name, description, etc.
   */
  private readonly info: ICommand;

  /**
   * Constructor for the Command class.
   *
   * @param {Whoa} client - The Whoa (Discord client) instance.
   * @param {ICommand} info - Command-specific details and configurations.
   */
  constructor(client: Whoa, info: ICommand) {
    this.client = client;
    this.info = info;
  }

  /**
   * Error handler to manage any command-related errors.
   *
   * @param {Message} message - The message triggering the command.
   * @param {any} error - The error object or message.
   */
  async onError(message: Message, error: any) {
    Logger.log(
      'ERROR',
      `An error occurred with ${this.info.name}. \n${error}\n`,
    );

    await message.channel.send({
      embeds: [
        {
          color: 0xff0000,
          title: '❌・Error',
          description: `Dear ${message.author}, an error occurred while running your command. We have already notified the staff. Please wait until it's fixed, and you'll be notified once it's resolved.`,
        },
      ],
    });
  }

  /**
   * Determines if a user has the required permissions to use a command.
   *
   * @param {Message} message - The message triggering the command.
   * @returns {boolean} - True if the user can use the command, false otherwise.
   */
  canUse(message: Message): boolean {
    if (this.info.enabled === false) return false;
    if (this.info.require) {
      if (this.info.require.developer && !isDev(this.client, message.author.id))
        return false;
      if (
        this.info.require.permissions &&
        !isDev(this.client, message.author.id)
      ) {
        const perms: string[] = [];
        this.info.require.permissions.forEach((permission) => {
          if ((message.member as GuildMember).permissions.has(permission))
            return;
          else return perms.push(permission);
        });
        if (perms.length) return false;
      }
    }
    return true;
  }

  /**
   * Abstract method to run the command. Must be implemented in derived classes.
   *
   * @param {Message} message - The message triggering the command.
   * @param {string[]} args - Arguments passed with the command.
   * @param {Function} [cancelCooldown] - Optional function to cancel the command cooldown.
   * @returns {Promise<any>} - Resolves when the command execution is complete.
   */
  abstract run(
    message: Message,
    args: string[],
    cancelCooldown?: () => void,
  ): Promise<any>;
}
