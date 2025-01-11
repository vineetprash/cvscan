import express, { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fileRoutes from './routes/fileRoutes';
import resultRoutes from './routes/resultRoutes';


const app = express();

const PORT = 3000;
const inputDir = path.join(__dirname, 'input');  // Absolute path to input folder
const outputDir = path.join(__dirname, 'output');  // Absolute path to output folder
// Middleware
app.use(express.static('views'));
app.use('/input', express.static(inputDir)); // Serve uploaded files
app.use('/output', express.static(outputDir)); // Serve uploaded files
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/files', fileRoutes);
app.use('/results', resultRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  console.log("DIRNAME: ", __dirname, __filename)
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
