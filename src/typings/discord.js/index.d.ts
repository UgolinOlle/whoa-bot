import 'discord.js';

declare module 'discord.js' {
  interface ClientEvents {
    ready: [];
    raw: [package: any];
  }

  interface Client {
    emit(event: 'ready'): boolean;
  }
}
