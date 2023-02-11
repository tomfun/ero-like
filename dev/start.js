const commander = require('node-shell-commandor');

commands = [{
  command: 'docker-compose up'
}, {
  command: 'cd api && npm run start:dev'
}, {
  command: 'cd my-vue3-app && npm run serve'
}];

commander.run(commands);
