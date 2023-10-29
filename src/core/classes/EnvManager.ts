import dotenv from 'dotenv';
import EnvError from '../exceptions/EnvError';

/**
 * Environment Manager class.
 * Handles the loading and validation of environment variables.
 */
export default class EnvManager {
  /**
   * Loads environment variables using dotenv and validates them.
   */
  public static load() {
    dotenv.config();
    this.validate(process.env);
  }

  /**
   * Validates necessary environment variables.
   * Throws an error if a required variable is missing or invalid.
   *
   * @param {NodeJS.ProcessEnv} env - The environment variables object.
   */
  private static validate(env: NodeJS.ProcessEnv) {
    if (env.TOKEN === '') throw new EnvError("Discord token doesn't exist.");
    if (env.PREFIX === '') throw new EnvError("Prefix doesn't exist.");
    if (env.DISCORD_MODE != 'dev' || 'prod')
      throw new EnvError("Discord mode doesn't exist.");
    if (env.DEVELOPERS === '')
      throw new EnvError("Developers id doesn't exist.");
  }
}
