import { Commands, Session } from './core';
import commands from './commands';

const session = new Session();
const commandsWrapper = new Commands(commands);

session.on('message_create', (msg) => {
  commandsWrapper.observe(msg, session);
});

session.start();
