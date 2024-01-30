import Whoa from '../structures/Whoa';
import messages from '../utils/Messages';

import { IInteractionInterface } from '../interfaces/Interaction';
import { CommandInteraction, GuildMember } from 'discord.js';

export default class InteractionHandler {
  static async handleInteraction(
    client: Whoa,
    interaction: CommandInteraction,
  ) {
    await interaction.deferReply();

    const { commandName } = interaction;
    const command = client.handler.interactions.get(commandName);

    if (!command)
      return await interaction.followUp({
        ephemeral: true,
        embeds: [messages.error().setDescription('Command not found.')],
      });

    if (
      command.info.permission &&
      command.info.permission.some(
        (p) => !(interaction.member as GuildMember).permissions.has(p),
      ) &&
      !client.config.developers.includes(interaction.user.id)
    )
      return await interaction.followUp({
        ephemeral: true,
        embeds: [
          messages
            .error()
            .setDescription("You don't have the right permissions"),
        ],
      });

    try {
      await command.run({
        client,
        interaction: interaction as IInteractionInterface,
      });
    } catch (error) {}
  }
}
