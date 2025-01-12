import express, { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fileRoutes from './routes/fileRoutes';
import resultRoutes from './routes/resultRoutes';
import fs from "fs"
import cors from "cors"

const app = express();

const PORT = 3000;
export const inputDir = process.env.INPUT_DIR || path.join(__dirname, 'input');  // Absolute path to input folder
export const outputDir = process.env.OUTPUT_DIR || path.join(__dirname, 'output');  // Absolute path to output folder


// Middleware
app.use(express.static('views'));
app.use('/input', express.static(inputDir)); // Serve uploaded files
app.use('/output', express.static(outputDir)); // Serve uploaded files
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
// Routes
app.use('/files', fileRoutes);
app.use('/results', resultRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  console.log("DIRNAME: ", __dirname, __filename)
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/config/update', (req: any, res: any) => {
  const { inputDir, outputDir } = req.body;

  // Validate inputs (optional)
  if (!inputDir && !outputDir) {
    return res.status(400).send("No directories provided.");
  }

  const envFilePath = path.join(__dirname, '../.env');
  let envConfig = fs.readFileSync(envFilePath, 'utf-8');

  if (inputDir) {
    envConfig = envConfig.replace(/INPUT_DIR=.*/, `INPUT_DIR=${inputDir}`);
  }
  if (outputDir) {
    envConfig = envConfig.replace(/OUTPUT_DIR=.*/, `OUTPUT_DIR=${outputDir}`);
  }

  // Update .env file
  fs.writeFileSync(envFilePath, envConfig);

  res.send(`<div class="text-green-400">Directories updated successfully!</div>`);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
