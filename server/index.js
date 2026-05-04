const app = require('./src/app');
const { connectDatabase } = require('./src/db');

const PORT = Number(process.env.PORT || 4000);
const HOST = '0.0.0.0';

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

async function start() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('Database connection failed, continuing without database:', error.message);
  }

  app.listen(PORT, HOST, () => {
    console.log('Server started');
    console.log(`Listening on PORT ${PORT}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
