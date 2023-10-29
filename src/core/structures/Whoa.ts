import { Client, IntentsBitField } from 'discord.js';
import { IConfig } from '../interfaces/Config';

/**
 * Custom Discord client class, "Whoa".
 * Extends the base Client class from discord.js and provides additional functionality.
 */
export default class Whoa extends Client {
  /**
   * Configuration object derived from environment variables.
   */
  public readonly config: IConfig;

  /**
   * Constructor for the Whoa class.
   *
   * @param {IntentsBitField} intents - Bitfield of GatewayIntents for the discord.js client.
   */
  constructor(intents: IntentsBitField) {
    super({ intents });

    // Load configuration from environment variables.
    this.config = {
      token: process.env.TOKEN as string,
      prefix: process.env.PREFIX as string,
      discord_mode: process.env.DISCORD_MODE as string,
      developers: JSON.parse(process.env.DEVELOPERS as string) as string[],
    };
  }
}
