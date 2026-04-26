const app = require('./src/app');
const { connectDatabase } = require('./src/db');

const port = Number(process.env.PORT || 4000);

async function start() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`Steady TJ API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
