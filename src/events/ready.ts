import client from '../client';
import Logger from '../core/classes/Logger';
import Event from '../core/structures/Event';
import Whoa from '../core/structures/Whoa';

export default class ReadyEvent extends Event {
  constructor(client: Whoa) {
    super(client, 'ready');
  }

  async run(): Promise<any> {
    Logger.log(
      'INFO',
      `${this.client.user?.tag} as been launched successfully.`,
    );
  }
}
