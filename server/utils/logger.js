const bunyan = require('bunyan');
const Logsene = require('bunyan-logsene');
const PrettyStream = require('bunyan-prettystream');

const logseneStream = new Logsene({
  token: process.env.LOGSENE_KEY || '8570b558-dd76-48ee-8a4d-ac12b60daa3e', // default to sandbox
});

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const logger = (name = 'default-js-logger') => {
  const log = bunyan.createLogger({
    name,
    serializers: bunyan.stdSerializers,
    streams: [
      {
        level: process.env.CONSOLE_LOG_LEVEL || 'debug',
        type: 'raw',
        stream: prettyStdOut,
      },
      {
        level: process.env.LOGSENSE_LEVEL || 'debug',
        stream: logseneStream,
        type: 'raw',
        reemitErrorEvents: true,
      },
    ],
  });
  log.on('error', (err, stream) => {
    console.error('Problem communicating with logging server...');
    return console.error(stream);
  });
  log.trace(`${name} logging started.`);
  return log;
};

module.exports = logger;
