import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import axios from 'axios';

const LatexEditorAndPreview = () => {
    const [latexCode, setLatexCode] = useState('\\documentclass{article}\n\\begin{document}\nHello, world!\n\\end{document}');
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        const compileLatexToPdf = async () => {
            try {
                const response = await axios.post('http://localhost:5000/api/compile-latex', { latexCode }, { responseType: 'arraybuffer' });
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfData(url);
            } catch (error) {
                console.error('Error compiling LaTeX:', error);
            }
        };

        compileLatexToPdf();
    }, [latexCode]);

    const handleChange = (event) => {
        setLatexCode(event.target.value);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <textarea
                value={latexCode}
                onChange={handleChange}
                style={{ width: '50%', height: '100%', padding: '10px', fontFamily: 'monospace', fontSize: '16px' }}
            />
            <div style={{ width: '50%', height: '100%' }}>
                {pdfData && (
                    <Document file={pdfData}>
                        <Page pageNumber={1} />
                    </Document>
                )}
            </div>
        </div>
    );
};

export default LatexEditorAndPreview;
