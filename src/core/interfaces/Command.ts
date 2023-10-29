import { PermissionsString } from 'discord.js';

/**
 * Interface commands.
 */
export interface ICommand {
  name: string;
  description: string;
  group: string;
  aliases?: string[];
  cooldown?: number;
  enabled?: boolean;
  require?: ICommandRequires;
}

/**
 * Interface command requirements.
 */
export interface ICommandRequires {
  developer?: boolean;
  permissions?: PermissionsString[];
}
