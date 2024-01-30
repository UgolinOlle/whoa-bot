import Whoa from './Whoa';
import { CommandArgs, IInteractionInterface } from '../interfaces/Interaction';

export default abstract class Interaction {
  /**
   * Reference to the Whoa (Discord client) instance.
   */
  public readonly client: Whoa;

  /**
   * Command-specific information such as name, description, etc.
   */
  public readonly info: IInteractionInterface;

  constructor(client: Whoa, info: IInteractionInterface) {
    this.client = client;
    this.info = info;
  }

  abstract run(args: CommandArgs): Promise<any>
}
