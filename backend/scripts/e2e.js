const { spawn } = require('child_process');
const path = require('path');

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const backendDistMain = path.join(__dirname, '..', 'dist', 'main.js');

  console.log('Building server is assumed done. Starting server...');
  const server = spawn(process.execPath, [backendDistMain], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: { ...process.env },
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
  });

  // Give the server a moment to boot
  await wait(1500);

  console.log('Running API tests...');
  await new Promise((resolve) => {
    const tester = spawn(process.execPath, [path.join(__dirname, '..', 'test-api.js')], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      env: { ...process.env },
    });
    tester.on('close', () => resolve());
  });

  console.log('Stopping server...');
  try {
    server.kill('SIGTERM');
  } catch (_) {}
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


