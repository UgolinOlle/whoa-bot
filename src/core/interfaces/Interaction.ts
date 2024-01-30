import {
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  PermissionResolvable,
  SlashCommandBuilder,
} from 'discord.js';

import Whoa from '../structures/Whoa';
import { ICommandRequires } from './Command';

export interface IInteractionInterface {
  guild: Guild;
  member: GuildMember;
  channel: GuildTextBasedChannel;

  enabled?: boolean;
  devOnly?: boolean;
  permission?: PermissionResolvable[];

  builder: SlashCommandBuilder;
}

export type CommandArgs = {
  client: Whoa;
  interaction: IInteractionInterface;
};
