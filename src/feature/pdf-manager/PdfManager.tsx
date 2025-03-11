import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import AddPdfButton from './components/AddPdfButton';
import { DeletePdfButton } from './components/DeletePdfButton';
import { PdfSelect } from './components/PdfSelect';
import PdfViewer from './components/PdfViewer';
import { ZoomInButton } from './components/ZoomInButton';
import { ZoomOutButton } from './components/ZoomOutButton';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const PdfManager = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <PdfSelect />

        <div className="flex items-center gap-1">
          <AddPdfButton />
          <DeletePdfButton />
          <ZoomOutButton />
          <ZoomInButton />
        </div>
      </div>

      <PdfViewer />
    </div>
  );
};

export default PdfManager;
