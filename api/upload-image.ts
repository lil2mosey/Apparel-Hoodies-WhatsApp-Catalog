export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { imageData } = req.body || {};
    if (!imageData || typeof imageData !== 'string') {
      return res.status(400).json({ success: false, error: 'imageData is required' });
    }

    // In serverless, returning the optimized data URL or public URL ensures cross-platform reliability
    return res.status(200).json({
      success: true,
      url: imageData,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
