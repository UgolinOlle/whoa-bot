import { GatewayIntentBits, IntentsBitField } from 'discord.js';

import EnvManager from './core/classes/EnvManager';
import Whoa from './core/structures/Whoa';

// -- Validating .env file.
EnvManager.load();

const client = new Whoa([
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
]);
export default client;
