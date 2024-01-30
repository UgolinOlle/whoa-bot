import { SlashCommandBuilder } from 'discord.js';
import { WInteraction } from '../../core/structures/Interaction';

export default new WInteraction({
  builder: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  run: async ({ interaction }) => {
    console.log('ok');
    await interaction.followUp('Pong!');
  },
});
