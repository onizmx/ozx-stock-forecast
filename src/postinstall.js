const { exec } = require('child_process');

const { NODE_ENV, ORYX_ENV_NAME } = process.env;

const isProd = NODE_ENV === 'production';

if (!isProd || ORYX_ENV_NAME) {
  const commands = ['npx tsc', 'npm run copyfiles'];
  exec(commands.join('&&'), err => {
    if (err) throw err;
  });
}
