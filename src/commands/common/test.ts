import { Message } from 'discord.js';
import Command from '../../core/structures/Command';
import Whoa from '../../core/structures/Whoa';

export default class TestCommand extends Command {
  constructor(client: Whoa) {
    super(client, {
      name: 'test',
      description: 'A simple command to test for developer',
      group: 'Developer',
      require: {
        developer: false,
      },
    });
  }

  async run(message: Message): Promise<any> {
    await message.reply('ok');
  }
}
