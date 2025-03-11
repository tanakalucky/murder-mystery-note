import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUp } from 'lucide-react';
import { Suspense, lazy } from 'react';
import { DeletePdfButton } from './components/DeletePdfButton';
import { PdfSelect } from './components/PdfSelect';
import { ZoomInButton } from './components/ZoomInButton';
import { ZoomOutButton } from './components/ZoomOutButton';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const PdfViewer = lazy(() => import('./components/PdfViewer'));
const AddPdfButton = lazy(() => import('./components/AddPdfButton'));

const AddPdfButtonSkeleton = () => (
  <Button size="icon" variant="outline" disabled>
    <FileUp className="h-4 w-4" />
  </Button>
);

const PdfViewerSkeleton = () => (
  <div className="flex-1 border rounded-md overflow-hidden">
    <div className="h-full flex flex-col items-center justify-center p-8">
      <Skeleton className="w-full max-w-md h-[500px]" />
      <div className="mt-4 flex justify-center space-x-4">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

const PdfManager = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <PdfSelect />

        <div className="flex items-center gap-1">
          <Suspense fallback={<AddPdfButtonSkeleton />}>
            <AddPdfButton />
          </Suspense>
          <DeletePdfButton />
          <ZoomOutButton />
          <ZoomInButton />
        </div>
      </div>

      <Suspense fallback={<PdfViewerSkeleton />}>
        <PdfViewer />
      </Suspense>
    </div>
  );
};

export default PdfManager;
