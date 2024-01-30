import { Interaction } from 'discord.js';

import Event from '../core/structures/Event';
import Whoa from '../core/structures/Whoa';
import CommandHandler from '../core/classes/CommandHandler';

export default class InteractionCreate extends Event {
  constructor(client: Whoa) {
    super(client, 'interactionCreate');
  }

  async run(client: Whoa, interaction: Interaction) {
    console.log(interaction);
    if (interaction.isCommand())
      await CommandHandler.handleInteraction(client, interaction);
  }
}
