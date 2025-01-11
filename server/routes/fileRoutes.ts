import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();
const uploadDir = path.join(__dirname, '../uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Generate HTML snippet for a single file
const generateFileHtml = (fileName: string): string => {
  const filePath = `files/pdf/${fileName}`;
  return `<li><span hx-get = ${filePath} hx-target = "#pdfviewer" hx-swap="innerHTML" target="_blank">${fileName}</span></li>`;
};

router.get('/pdf/:filename', (req: any, res: any) => {
  const { filename } = req.params;
  const pdfPath = path.join(__dirname, 'uploads', filename);

  // Check if the file exists
  if (!(path.extname(filename).toLowerCase() === '.pdf')) {
    return res.status(400).send('Invalid file type.');
  }

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>View PDF</title>
      <style>
        body { margin: 0; padding: 0; width: 100%}
        iframe { width: 100%; height: 100vh; border: none; }
      </style>
    </head>
    <body>
      <iframe src="/files/pdf/${filename}" title="PDF Viewer"></iframe>
    </body>
    </html>
  `);
});


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
