import { GuildMember, Message, TextChannel } from 'discord.js';

import Whoa from '../structures/Whoa';
import { isDev } from '../utils/common';

export default class CommandHandler {
  /**
   * Handles the commands.
   * @param client Whoa client
   * @param message Message object
   */
  static async handleCommand(client: Whoa, message: Message) {
    const self = message.guild?.members.cache.get(
      message.client.user?.id || '',
    ) as GuildMember;
    if (
      !self.permissions.has('SendMessages') ||
      !(message.channel as TextChannel)
        .permissionsFor(self)
        ?.has('SendMessages')
    )
      return;
    if (!self.permissions.has('Administrator'))
      return await message.channel.send({
        embeds: [
          {
            color: 0xff0000,
            title: '🚨・Missing Permission',
            description: `${message.author}, bot requires \`ADMINISTRATOR\` permission to be run.`,
          },
        ],
      });

    const prefix = client.config.prefix;
    if (message.content.toLocaleLowerCase().indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = (args.shift() as string).toLowerCase();
    const cmd = client.handler.findCommand(command);

    if (!cmd) return;
    if (cmd.info.enabled === false) return;
    if (cmd.info.require) {
      if (cmd.info.require.developer && !isDev(client, message.author.id))
        return;
      if (cmd.info.require.permissions && !isDev(client, message.author.id)) {
        const perms: string[] = [];
        cmd.info.require.permissions.forEach((permission) => {
          if ((message.member as GuildMember).permissions.has(permission))
            return;
          else return perms.push(`\`${permission}\``);
        });
        if (perms.length)
          return await message.channel.send({
            embeds: [
              {
                color: 0xfce100,
                title: '⚠️・Missing Permissions',
                description: `${
                  message.author
                }, you must have these permissions to run this command.\n\n${perms.join(
                  '\n',
                )}`,
              },
            ],
          });
      }
    }

    var addCooldown = false;

    const now = Date.now();
    const timestamps = client.handler.getCooldown(cmd.info.name);
    const cooldownAmount = cmd.info.cooldown ? cmd.info.cooldown * 1000 : 0;
    if (cmd.info.cooldown) {
      if (timestamps.has(message.author.id)) {
        const currentTime = timestamps.get(message.author.id);
        if (!currentTime) return;

        const expirationTime = currentTime + cooldownAmount;
        if (now < expirationTime) {
          await message.delete();
          const timeLeft = (expirationTime - now) / 1000;
          return await message.channel
            .send({
              embeds: [
                {
                  color: 0xffa500,
                  title: '⏰・Calm Down',
                  description: `${message.author}, you must wait to run this command.`,
                },
              ],
            })
            .then((msg) =>
              setTimeout(async () => await msg.delete().catch(() => {}), 3000),
            );
        }
      }

      addCooldown = true;
    }

    try {
      var applyCooldown = true;

      await cmd.run(message, args, () => {
        applyCooldown = false;
      });

      if (addCooldown && applyCooldown && !isDev(client, message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
    } catch (error) {
      await cmd.onError(message, error);
    }
  }
}
