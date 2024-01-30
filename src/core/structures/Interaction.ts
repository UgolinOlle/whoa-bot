import {
  CommandInteraction,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js';
import Whoa from './Whoa';
import { IInteractionRequires } from '../interfaces/Interaction';

export default class CInteraction extends CommandInteraction {
  member: GuildMember;
}

export type InteractionArgs = {
  client: Whoa;
  interaction: CInteraction;
};

export class WInteraction {
  enabled?: boolean;
  require?: IInteractionRequires;
  builder: SlashCommandBuilder;
  run: (args: InteractionArgs) => void;

  /**
   * Create a new commands
   *
   * @param options Command options
   */
  constructor(options: NonNullable<WInteraction>) {
    Object.assign(this, options);
  }
}
