import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import fs from 'node:fs';
import path from 'node:path';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const host = '0.0.0.0';

const frontendDir = path.resolve(process.cwd(), 'apps/frontend');
const rootDir = process.cwd();

// In development mode, remove any production build artifacts (BUILD_ID) to avoid webpack chunk mismatches
if (dev) {
  const devNextDir = path.join(frontendDir, '.next');
  if (fs.existsSync(path.join(devNextDir, 'BUILD_ID'))) {
    console.log('> Removing BUILD_ID in development mode...');
    fs.rmSync(path.join(devNextDir, 'BUILD_ID'), { force: true });
  }
} else {
  // In production mode, if .next exists in root but not in apps/frontend, copy it over
  if (!fs.existsSync(path.join(frontendDir, '.next')) && fs.existsSync(path.join(rootDir, '.next'))) {
    fs.cpSync(path.join(rootDir, '.next'), path.join(frontendDir, '.next'), { recursive: true });
  }
}

const dir = frontendDir;

const app = next({ dev, dir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url || '/', true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, host, () => {
    console.log(`> Ready on http://${host}:${port}`);
  });
}).catch((err) => {
  console.error('Error preparing Next app:', err);
  process.exit(1);
});
