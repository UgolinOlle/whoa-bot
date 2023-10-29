import chalk from 'chalk';
import moment from 'moment-timezone';

import { LogType } from '../types/Logger';

/**
 * Logger utility class.
 * Provides a structured and color-coded logging mechanism.
 */
export default class Logger {
  /**
   * Log a message with a specific type and format.
   *
   * @param {LogType} type - The type/category of the log (e.g., ERROR, SUCCESS).
   * @param {string} message - The main content of the log.
   * @param {string} [format='DD/MM/YYYY HH:mm:ss'] - The desired format for the timestamp.
   */
  public static log(
    type: LogType,
    message: string,
    format: string = 'DD/MM/YYYY HH:mm:ss',
  ) {
    // -- The color associated with the log type.
    var colors: 'green' | 'yellow' | 'red' | 'blue' | 'magenta';

    switch (type) {
      case 'SUCCESS':
        colors = 'green';
        break;
      case 'WARNING':
        colors = 'yellow';
        break;
      case 'ERROR':
        colors = 'red';
        break;
      case 'INFO':
        colors = 'blue';
        break;
      case 'DEBUG':
        colors = 'magenta';
        break;
    }

    // -- Outputs the formatted log to the console.
    console.log(
      `${chalk.cyan(`${moment().format(format)}`)} ${chalk[colors].bold(
        `${type}`,
      )}: ${message}`,
    );
  }
}
