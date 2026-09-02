import fs from 'fs';
import path from 'path';

let memoryPhotos: any[] = [];

function getDataDir() {
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
  const filePath = path.join(dir, 'photos.json');

  if (req.method === 'POST') {
    try {
      const { photos } = req.body || {};
      if (Array.isArray(photos)) {
        memoryPhotos = photos;
        try {
          fs.writeFileSync(filePath, JSON.stringify(photos, null, 2), 'utf-8');
        } catch {
          // ignore
        }
        return res.status(200).json({ success: true, message: 'Photos saved' });
      }
      return res.status(400).json({ success: false, error: 'Photos array required' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET
  try {
    if (memoryPhotos && memoryPhotos.length > 0) {
      return res.status(200).json({ success: true, photos: memoryPhotos });
    }
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryPhotos = parsed;
      return res.status(200).json({ success: true, photos: parsed });
    }
    return res.status(200).json({ success: true, photos: [] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
