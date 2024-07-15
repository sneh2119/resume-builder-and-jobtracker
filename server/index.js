// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/api/compile-latex', (req, res) => {
    const latexCode = req.body.latexCode;
    const inputPath = path.join(__dirname, 'input.tex');
    const outputPath = path.join(__dirname, 'output.pdf');

    fs.writeFileSync(inputPath, latexCode);

    exec(`pdflatex -output-directory=${__dirname} ${inputPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error compiling LaTeX: ${stderr}`);
            res.status(500).send('Error compiling LaTeX');
            return;
        }

        fs.readFile(outputPath, (err, data) => {
            if (err) {
                console.error(`Error reading PDF file: ${err}`);
                res.status(500).send('Error reading PDF file');
                return;
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.send(data);

            // Clean up temporary files
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
            fs.unlinkSync(path.join(__dirname, 'input.aux'));
            fs.unlinkSync(path.join(__dirname, 'input.log'));
        });
    });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
