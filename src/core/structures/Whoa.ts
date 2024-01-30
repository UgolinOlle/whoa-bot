import { Client, GatewayIntentBits } from 'discord.js';

import { IConfig } from '../interfaces/Config';
import WhoaHandler from '../classes/WhoaHandler';

/**
 * Custom Discord client class, "Whoa".
 * Extends the base Client class from discord.js to provide specific functionality
 * tailored to the Whoa bot, including a configuration loader and a handler.
 */
export default class Whoa extends Client {
  /**
   * Configuration object which holds important settings derived from
   * the environment variables. This includes the bot's token, prefix,
   * mode, and developer IDs.
   */
  public readonly config: IConfig;

  /**
   * Handler for the Whoa bot which manages command and event registration,
   * and other bot-specific logic.
   */
  public readonly handler: WhoaHandler;

  /**
   * Constructor for the Whoa class.
   * Initializes the configuration, sets up the handler, and registers all commands/events.
   *
   * @param {GatewayIntentBits[]} intents - Bitfield of GatewayIntents required for
   * the operations of the discord.js client.
   */
  constructor(intents: GatewayIntentBits[]) {
    // Call the parent constructor with the provided intents
    super({ intents });

    // Load bot configuration settings from environment variables.
    this.config = {
      token: process.env.TOKEN as string,
      prefix: process.env.PREFIX as string,
      discord_mode: process.env.DISCORD_MODE as string,
      developers: ['445957680729817088'],
      guildID: process.env.GUILD_ID as string,
    };

    // Initialize the Whoa bot handler
    this.handler = new WhoaHandler(this);

    // Register all available commands and events through the handler
    this.handler.registerAll();
  }
}
