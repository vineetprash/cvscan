import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();
const uploadDir = path.join(__dirname, '../../input');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Generate HTML snippet for a single file
const generateFileHtml = (fileName: string): string => {
  const filePath = `/input/${fileName}`;
  return `<li><span class="cursor-pointer" onclick="window.location.href='${filePath}'; " target="_blank">${fileName}</span></li>`;
};




// Handle file uploads
router.post('/upload', (req: any, res: any) => {
  if (!req.files || !req.files.files) {
    return res.status(400).send('No files were uploaded.');
  }

  const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
  const fileHtmlSnippets: string[] = [];

  files.forEach((file: any) => {
    const uploadPath = path.join(uploadDir, file.name);
    file.mv(uploadPath, (err: Error) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error uploading file.');
      }
      fileHtmlSnippets.push(generateFileHtml(file.name));
    });
  });

  // Wait until all files are processed before responding
  Promise.all(fileHtmlSnippets).then(() => {
    res.send(fileHtmlSnippets.join(''));
  });
});

// Fetch all uploaded files
router.get('/list', (req, res) => {
  const files = fs.readdirSync(uploadDir);
  const fileHtml = files.map(generateFileHtml).join('');
  res.send(fileHtml);
});

export default router;
