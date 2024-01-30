import moment from 'moment-timezone';
import client from './client';

// -- Setting up timezone.
moment.locale('en');

// -- Launch whoa bot.
client.login(client.config.token);
