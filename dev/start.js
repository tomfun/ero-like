const { resolve } = require('path');
const commander = require('node-shell-commandor');

commands = [{
  command: 'docker-compose up'
}, {
  command: 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"; nvm use && npm run start:dev',
  opt: {
    cwd: resolve(__dirname, '..', 'api'),
  }
}, {
  command: 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"; nvm use && npm run serve',
  opt: {
    cwd: resolve(__dirname, '..', 'my-vue3-app'),
  }
}];

commander.run(commands);
