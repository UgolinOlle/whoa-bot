import { Collection } from 'discord.js';
import requireAll from 'require-all';
import path from 'path';

import Whoa from '../structures/Whoa';
import Command from '../structures/Command';
import Event from '../structures/Event';
import RegistryError from '../exceptions/RegistryError';
import Logger from './Logger';
import { isConstructor } from '../utils/common';
import { WInteraction } from '../structures/Interaction';

/**
 * The handler class for managing the commands and events for the Whoa bot.
 */
export default class WhoaHandler {
  private client: Whoa;
  private commands: Collection<string, Command>;
  private commandPaths: string[] = [];
  private events: Collection<string, Event>;
  private eventPaths: string[] = [];
  private interactions: Collection<string, WInteraction>;
  private cooldowns: Collection<string, Collection<string, number>>;
  private groups: Collection<string, string[]>;

  /**
   * Constructor for the WhoaHandler class.
   *
   * @param {Whoa} client - The Whoa (Discord client) instance.
   */
  constructor(client: Whoa) {
    this.client = client;
    this.commands = new Collection<string, Command>();
    this.events = new Collection<string, Event>();
    this.interactions = new Collection<string, WInteraction>();
    this.cooldowns = new Collection<string, Collection<string, number>>();
    this.groups = new Collection<string, string[]>();
  }

  /**
   * Register a single event to the Whoa bot.
   *
   * @param {Event} event - The event instance to be registered.
   */
  private registerEvent(event: Event) {
    if (this.events.some((e) => e.name === event.name))
      throw new RegistryError(`${event.name} has been already registered.`);

    this.events.set(event.name, event);
    this.client.on(event.name, event.run.bind(event));
    Logger.log('INFO', `Event ${event.name} registered successfully.`);
  }

  /**
   * Scans and registers all events in the specified directory.
   */
  private registerAllEvents() {
    const events: any[] = [];

    // Remove cached events
    if (this.eventPaths.length) {
      this.eventPaths.forEach((p) => {
        delete require.cache[p];
      });
    }

    // Load all events from directory
    requireAll({
      dirname: path.join(__dirname, '../../events'),
      recursive: true,
      filter: /\w*.[tj]s/g,
      resolve: (x) => events.push(x),
      map: (name: string, filePath: string) => {
        if (filePath.endsWith('.ts'))
          this.eventPaths.push(path.resolve(filePath));
        return name;
      },
    });

    // Register each loaded event
    for (let event of events) {
      const valid =
        isConstructor(event, Event) ||
        isConstructor(event.default, Event) ||
        event instanceof Event ||
        event.default instanceof Event;

      if (!valid) continue;

      if (isConstructor(event, Event)) event = new event(this.client);
      else if (isConstructor(event.default, Event))
        event = new event.default(this.client);
      if (!(event instanceof Event))
        throw new RegistryError(`Invalid event register: ${event}.`);

      this.registerEvent(event);
    }
  }

  /**
   * Registers a single command to the Whoa bot.
   *
   * @param {Command} command - The command instance to be registered.
   */
  private registerCommand(command: Command) {
    if (
      this.commands.some((x) => {
        if (x.info.name === command.info.name) return true;
        else if (x.info.name && x.info.aliases?.includes(command.info.name))
          return true;
        else return false;
      })
    )
      throw new RegistryError(
        `${command.info.name} has been already registered.`,
      );

    if (command.info.aliases) {
      for (const alias of command.info.aliases) {
        if (
          this.commands.some((x) => {
            if (x.info.name === alias) return true;
            else if (x.info.aliases && x.info.aliases.includes(alias))
              return true;
            else return false;
          })
        )
          throw new RegistryError(
            `${command.info.name} has been already registered.`,
          );
      }
    }

    this.commands.set(command.info.name, command);
    if (!this.groups.has(command.info.group))
      this.groups.set(command.info.group, [command.info.name]);
    else {
      const groups = this.groups.get(command.info.group) as string[];

      groups.push(command.info.name);
      this.groups.set(command.info.group, groups);
    }
    Logger.log(
      'INFO',
      `Command ${command.info.name} has been successfully registered.`,
    );
  }

  /**
   * Scans the commands directory and registers all valid command files to the Whoa bot.
   */
  private registerAllCommands() {
    const commands: any[] = [];

    // Remove cached commands
    if (this.commandPaths.length)
      this.commandPaths.forEach((p) => {
        delete require.cache[p];
      });

    // Load all commands from directory
    requireAll({
      dirname: path.join(__dirname, '../../commands'),
      recursive: true,
      filter: /\w*.[tj]s/g,
      resolve: (x) => commands.push(x),
      map: (name: string, filePath: string) => {
        if (filePath.endsWith('.ts'))
          this.commandPaths.push(path.resolve(filePath));
        return name;
      },
    });

    // Register each loaded command
    for (let command of commands) {
      const valid =
        isConstructor(command, Command) ||
        isConstructor(command.default, Command) ||
        command instanceof Command ||
        command.default instanceof Command;

      if (!valid) return;
      if (isConstructor(command, Command)) command = new command(this.client);
      else if (isConstructor(command.default, Command))
        command = new command.default(this.client);
      if (!(command instanceof Command))
        throw new RegistryError(`Invalid command register: ${command}`);

      this.registerCommand(command);
    }
  }

  /**
   * Scan all interaction command and register them.
   */
  private async registerAllInteractions() {
    requireAll({
      dirname: path.join(__dirname, '../../interactions'),
      recursive: true,
      filter: /\w*.[tj]s/g,
      resolve: (x) => {
        const interaction = x.default as WInteraction;

        if (interaction.enabled) return;
        if (interaction.require?.permission)
          interaction.builder.setDefaultMemberPermissions(0);

        this.interactions.set(interaction.builder.name, interaction);
        Logger.log(
          'INFO',
          `Interaction ${interaction.builder.name} registered successfully.`,
        );
      },
    });
  }

  /**
   * Deploy all interaction commands to the guild.
   */
  public async deployAllInteractions() {
    const guild = this.client.guilds.cache.get(this.client.config.guildID)!;
    const interactionsJSON = [...this.interactions.values()].map((x) =>
      x.builder.toJSON(),
    );

    const getRoles = (role: string) => {
      const permissions = this.interactions.find((x) => x.builder.name === role)
        ?.require?.permission;

      if (!permissions) return null;
      else
        return guild.roles.cache.filter(
          (x) => x.permissions.has(permissions) && !x.managed,
        );
    };

    // TODO: Add dev only permissions
    // TODO: Add full permissions access

    await guild.commands.set(interactionsJSON);
  }

  /**
   * Finds and returns a command based on its name or one of its aliases.
   *
   * @param {string} command - The name or alias of the command to be searched for.
   * @returns {Command | undefined} - Returns the found command or `undefined` if no matching command is found.
   */
  public findCommand(command: string): Command | undefined {
    return (
      this.commands.get(command) ||
      [...this.commands.values()].find(
        (c) => c.info.aliases && c.info.aliases.includes(command),
      )
    );
  }

  /**
   * Find and returns an interactions based on its name.
   *
   * @param {string} interaction - The name of the interaction to be searched for.
   * @returns {WInteraction | undefined} - Returns the found interaction or `undefined` if no matching interaction is found.
   */
  public findInteraction(interaction: string): WInteraction | undefined {
    return this.interactions.get(interaction);
  }

  /**
   * Retrieves a list of all command groups currently registered.
   *
   * @returns {string[]} - Returns an array of command group names.
   */
  public findCommandsInGroup(): string[] {
    return [...this.groups.keys()];
  }

  /**
   * Retrieves the cooldown collection for a specific command.
   * If the cooldown collection for the specified command does not exist, it initializes a new one.
   *
   * @param {string} name - The name of the command to get the cooldown for.
   * @returns {Collection<string, number>} - Returns a collection of user IDs mapped to cooldown expiration times.
   */
  public getCooldown(name: string): Collection<string, number> {
    if (!this.cooldowns.has(name)) {
      this.cooldowns.set(name, new Collection<string, number>());
    }
    return this.cooldowns.get(name) as Collection<string, number>;
  }

  /**
   * Registers all commands and events.
   */
  public registerAll() {
    this.registerAllCommands();
    this.registerAllEvents();
    this.registerAllInteractions();
  }

  /**
   * Reloads all commands and events by first clearing them, then re-registering.
   */
  public reloadAndRegister() {
    const allEvents = [...this.events.keys()];
    allEvents.forEach((event) => this.client.removeAllListeners(event));

    this.commands = new Collection<string, Command>();
    this.interactions = new Collection<string, WInteraction>();
    this.events = new Collection<string, Event>();
    this.cooldowns = new Collection<string, Collection<string, number>>();
    this.registerAll();
  }
}
