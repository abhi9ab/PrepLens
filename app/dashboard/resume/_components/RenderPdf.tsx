'use client'
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import AtsScore from './AtsScore';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const RenderPdf = () => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const extractText = async (file: File) => {
    try {
      setLoading(true);
      setError('');

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      setPdfText(fullText);
      setLoading(false);
    } catch (err) {
      setError('Failed to extract text from PDF');
      setLoading(false);
      console.error('PDF text extraction error:', err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPdfFile(file);
      await extractText(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4 border border-black">
      <Card>
        <CardHeader>
          <CardTitle>Resume ATS Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {pdfFile && !loading && (
        <Card className="mt-4">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="border rounded-lg p-4 bg-slate-50 max-h-[100vh] overflow-y-auto">
                <Document
                  file={pdfFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  error={<div>Failed to load PDF</div>}
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="mb-4"
                    />
                  ))}
                </Document>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <div className='mx-auto w-fit h-fit'>
        <AtsScore pdfText={pdfText} />
      </div>
    </div>
  );
};

export default RenderPdf;