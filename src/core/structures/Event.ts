import { ClientEvents } from 'discord.js';

import Whoa from './Whoa';

/**
 * Abstract Event class serving as a blueprint for individual event handlers.
 */
export default abstract class Event {
  /**
   * Reference to the Whoa (Discord client) instance.
   */
  readonly client: Whoa;

  /**
   * Name of the event (e.g., 'message', 'guildJoin').
   */
  readonly name: keyof ClientEvents;

  /**
   * Constructor for the Event class.
   *
   * @param {Whoa} client - The Whoa (Discord client) instance.
   * @param {keyof ClientEvents} name - The name of the event.
   */
  constructor(client: Whoa, name: keyof ClientEvents) {
    this.client = client;
    this.name = name;
  }

  /**
   * Abstract method to handle the event. Must be implemented in derived classes.
   *
   * @param {...params} params - Parameters associated with the event.
   * @returns {Promise<any>} - Resolves when the event handling is complete.
   */
  abstract run(...params: any | undefined): Promise<any>;
}
