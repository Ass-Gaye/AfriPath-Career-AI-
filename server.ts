import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './server/apiRouter';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Attach API Routes
app.use('/api', apiRouter);

// Serve Static in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// Dynamic HTML serving with absolute Open Graph tags for social crawlers (WhatsApp, Facebook, Twitter, LinkedIn)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(404).send('Application build not found. Please run npm run build.');
  }

  try {
    let html = fs.readFileSync(indexPath, 'utf-8');
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
    const host = req.get('host') || `localhost:${PORT}`;
    const baseUrl = process.env.APP_URL || `${protocol}://${host}`;
    const ogImageUrl = `${baseUrl}/og-image.jpg`;

    // Replace relative og-image with dynamic absolute URL for social crawlers
    html = html
      .replace(/content="\/og-image\.jpg"/g, `content="${ogImageUrl}"`)
      .replace(/href="\/og-image\.jpg"/g, `href="${ogImageUrl}"`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (_err) {
    return res.sendFile(indexPath);
  }
});

app.listen(PORT, () => {
  console.log(`Gambia Career AI Server running on port ${PORT}`);
});
