import { EmbedBuilder } from 'discord.js';

const success = () => new EmbedBuilder().setColor('Green').setTitle('Success');

const error = () => new EmbedBuilder().setColor('Red').setTitle('Error');

export default { success, error };
