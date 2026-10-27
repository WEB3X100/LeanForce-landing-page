import fs from 'node:fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import { validateInquiry, type InquiryInput } from './src/lib/inquiry';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    'PORT environment variable is required but was not provided.',
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

function readJson(req: IncomingMessage) {
  return new Promise<InquiryInput>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > 20_000) {
        reject(new Error('too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')) as InquiryInput);
      } catch {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

function inquiryPath(req: IncomingMessage & { originalUrl?: string }) {
  const raw = req.originalUrl || req.url || '';
  const pathOnly = raw.split('?')[0].replace(/\/+$/, '');
  return pathOnly || '/';
}

function inquiryStore(): Plugin {
  const dir = path.resolve(import.meta.dirname, 'data');
  const handle = async (req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
    if (req.method !== 'POST' || inquiryPath(req) !== '/api/inquiries') {
      next();
      return;
    }
    try {
      const { errors, value } = validateInquiry(await readJson(req));
      if (!value) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, errors }));
        return;
      }
      fs.mkdirSync(dir, { recursive: true });
      fs.appendFileSync(path.join(dir, 'inquiries.jsonl'), `${JSON.stringify({ ...value, receivedAt: new Date().toISOString() })}\n`, 'utf8');
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true }));
    } catch {
      if (res.headersSent || res.writableEnded) return;
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, errors: { form: 'We could not read that inquiry. Try again.' } }));
    }
  };
  const attach = (middlewares: { use: Function }) => {
    middlewares.use((req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
      void handle(req, res, next);
    });
  };
  return {
    name: 'leanforce-inquiry-store',
    configureServer(server) {
      attach(server.middlewares);
      return () => attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    'BASE_PATH environment variable is required but was not provided.',
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    inquiryStore(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
