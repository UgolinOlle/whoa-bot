import { Message } from 'discord.js';
import Command from '../../core/structures/Command';
import Whoa from '../../core/structures/Whoa';
import Logger from '../../core/classes/Logger';

/**
 * Command to reboot the Whoa bot.
 *
 * This command is specifically intended for developers and provides a way
 * to restart the bot, reload its commands & events, and then log it back in.
 *
 * @extends {Command}
 */
export default class RebootCommand extends Command {
  /**
   * Creates an instance of RebootCommand.
   *
   * @param {Whoa} client - The client instance.
   */
  constructor(client: Whoa) {
    super(client, {
      name: 'reboot',
      description: 'Reboot Whoa bot.',
      group: 'Developer',
      require: {
        developer: true,
      },
    });
  }

  /**
   * Run the reboot command.
   *
   * This method logs a warning about the bot rebooting, destroys the client,
   * reloads the bot's commands and events, and then logs the bot back in.
   *
   * @param {Message} message - The message that triggered the command.
   * @param {string[]} args - The arguments provided with the command.
   * @returns {Promise<any>} - Resolves when the reboot process is complete.
   */
  async run(message: Message, args: string[]): Promise<any> {
    Logger.log(
      'WARNING',
      `${this.client.user?.tag} is rebooting (Requested by ${message.author.tag})`,
    );

    // -- Destroy client.
    this.client.destroy();

    // -- Reload commands & events.
    this.client.handler.reloadAndRegister();

    this.client.login(this.client.config.token).then(async () => {
      this.client.emit('ready');

      await message.channel.send({
        embeds: [
          {
            color: 0x008000,
            description: `${message.author}, bot rebooted successfully.`,
          },
        ],
      });
    });
  }
}
