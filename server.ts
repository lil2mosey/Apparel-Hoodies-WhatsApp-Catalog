import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with generous payload size for high-resolution images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Directories for persistent storage
  const dataDir = path.join(process.cwd(), 'data');
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve static uploads
  app.use('/uploads', express.static(uploadsDir));

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  // Get shared products catalog
  app.get('/api/products', (req, res) => {
    try {
      const filePath = path.join(dataDir, 'products.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return res.json({ success: true, products: JSON.parse(raw) });
      }
      return res.json({ success: true, products: null });
    } catch (err: any) {
      console.error('Error reading products:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save shared products catalog (persists across shared links and devices)
  app.post('/api/products', (req, res) => {
    try {
      const { products } = req.body;
      if (!Array.isArray(products)) {
        return res.status(400).json({ success: false, error: 'Products array required' });
      }
      const filePath = path.join(dataDir, 'products.json');
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
      return res.json({ success: true, message: 'Products saved successfully to server storage' });
    } catch (err: any) {
      console.error('Error saving products:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get photo assets
  app.get('/api/photos', (req, res) => {
    try {
      const filePath = path.join(dataDir, 'photos.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return res.json({ success: true, photos: JSON.parse(raw) });
      }
      return res.json({ success: true, photos: [] });
    } catch (err: any) {
      console.error('Error reading photos:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save photo assets
  app.post('/api/photos', (req, res) => {
    try {
      const { photos } = req.body;
      if (!Array.isArray(photos)) {
        return res.status(400).json({ success: false, error: 'Photos array required' });
      }
      const filePath = path.join(dataDir, 'photos.json');
      fs.writeFileSync(filePath, JSON.stringify(photos, null, 2), 'utf-8');
      return res.json({ success: true, message: 'Photo assets saved to server' });
    } catch (err: any) {
      console.error('Error saving photos:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Upload image endpoint: persists base64 to server file system
  app.post('/api/upload-image', (req, res) => {
    try {
      const { imageData, filename } = req.body;
      if (!imageData || typeof imageData !== 'string') {
        return res.status(400).json({ success: false, error: 'imageData is required' });
      }

      // If it's a data URL, write to file in /public/uploads
      if (imageData.startsWith('data:image/')) {
        const matches = imageData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          
          const cleanName = (filename || 'photo')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .substring(0, 30);
          const safeFilename = `${cleanName}_${Date.now()}.${extension}`;
          const filePath = path.join(uploadsDir, safeFilename);

          fs.writeFileSync(filePath, buffer);
          const publicUrl = `/uploads/${safeFilename}`;

          return res.json({
            success: true,
            url: publicUrl,
            filename: safeFilename
          });
        }
      }

      // If already a URL or path, return as is
      return res.json({ success: true, url: imageData });
    } catch (err: any) {
      console.error('Error uploading image to server:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Get Store Contact info
  app.get('/api/contact', (req, res) => {
    try {
      const filePath = path.join(dataDir, 'contact.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return res.json({ success: true, contact: JSON.parse(raw) });
      }
      return res.json({ success: true, contact: null });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Save Store Contact info
  app.post('/api/contact', (req, res) => {
    try {
      const { contact } = req.body;
      const filePath = path.join(dataDir, 'contact.json');
      fs.writeFileSync(filePath, JSON.stringify(contact, null, 2), 'utf-8');
      return res.json({ success: true, message: 'Store contact saved' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Vite middleware for development vs Static SPA in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gryson's Apparel server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
