import { PermissionResolvable } from 'discord.js';

/**
 * Interface for the Interaction class
 */
export interface IInteractionRequires {
  developer?: boolean;
  permission?: PermissionResolvable[];
}
