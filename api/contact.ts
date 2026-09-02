import fs from 'fs';
import path from 'path';

let memoryContact: any = null;

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
  const filePath = path.join(dir, 'contact.json');

  if (req.method === 'POST') {
    try {
      const { contact } = req.body || {};
      memoryContact = contact;
      try {
        fs.writeFileSync(filePath, JSON.stringify(contact, null, 2), 'utf-8');
      } catch {
        // ignore
      }
      return res.status(200).json({ success: true, message: 'Contact saved' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET
  try {
    if (memoryContact) {
      return res.status(200).json({ success: true, contact: memoryContact });
    }
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryContact = parsed;
      return res.status(200).json({ success: true, contact: parsed });
    }
    return res.status(200).json({ success: true, contact: null });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
