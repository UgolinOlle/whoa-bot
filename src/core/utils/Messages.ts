import { EmbedBuilder } from 'discord.js';

const error = () => new EmbedBuilder().setColor('Red').setTitle('Error');

export default { error };
