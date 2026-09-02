import fs from 'fs';
import path from 'path';

// Memory cache fallback for serverless cold-starts
let memoryProducts: any[] | null = null;

function getDataDir() {
  // Use /tmp in serverless/Vercel or local data dir
  const tmpDir = path.join('/tmp', 'data');
  if (!fs.existsSync(tmpDir)) {
    try {
      fs.mkdirSync(tmpDir, { recursive: true });
    } catch {
      // ignore
    }
  }
  return tmpDir;
}

export default function handler(req: any, res: any) {
  const dir = getDataDir();
  const filePath = path.join(dir, 'products.json');

  if (req.method === 'POST') {
    try {
      const { products } = req.body || {};
      if (Array.isArray(products)) {
        memoryProducts = products;
        try {
          fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
        } catch {
          // in serverless read-only mode, memoryProducts will handle it
        }
        return res.status(200).json({ success: true, message: 'Products saved' });
      }
      return res.status(400).json({ success: false, error: 'Products array required' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET
  try {
    if (memoryProducts) {
      return res.status(200).json({ success: true, products: memoryProducts });
    }
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryProducts = parsed;
      return res.status(200).json({ success: true, products: parsed });
    }
    return res.status(200).json({ success: true, products: null });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
