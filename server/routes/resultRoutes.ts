import express, { Router, Request, Response } from 'express';
import fs from 'fs';
import dotenv from 'dotenv';
import path from "path"
import { processResumes } from '../..';
import { inputDir, outputDir } from '..';

dotenv.config();

const router = Router();
// Route to process resumes
router.get('/process-resumes', async (req: any, res: any) => {
    
  
    // Ensure the directories exist
    if (!fs.existsSync(inputDir)) {
      return res.status(400).send(`Input directory ${inputDir} does not exist.`);
    }
  
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
  
    // Check for the processed.csv file, and create it if not exists
    const processedCsvPath = path.join(outputDir, 'processed.csv');
    if (!fs.existsSync(processedCsvPath)) {
      fs.writeFileSync(processedCsvPath, "name,result,college,city,phone,gender,degree,year,gpa,interest1,interest2,interest3,summary,points_collegeReputation,points_degree,points_gpa,points_projects,points_bonus,points_total,tokens_input,tokens_output,timestamp\n");
    }
  
    try {
    //   await processResumes(inputDir, outputDir);
  
      // Generate the link to the processed file (processed.csv)
      const fileUrl = `/output/processed.csv`;
  
      // Return the file link in the response (HTMX will use it)
      const successNotification = `
        <div class="alert alert-success">
          Processing completed successfully!
          <br>
          <a href="${fileUrl}" class="btn btn-success" download>Download Processed File (CSV)</a>
        </div>
      `;
      res.send(successNotification);  // HTMX will swap this content into the page.
    } catch (error) {
      console.error('Error processing resumes:', error);
      res.status(500).send('<div class="alert alert-danger">Error processing resumes.</div>');
    }
});
  
export default router;