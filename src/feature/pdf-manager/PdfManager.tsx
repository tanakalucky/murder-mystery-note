import { Suspense, lazy } from 'react';
import AddPdfButton from './components/AddPdfButton';
import { DeletePdfButton } from './components/DeletePdfButton';
import { PdfSelect } from './components/PdfSelect';
import PdfViewerSkeleton from './components/PdfViewerSkeleton';
import { ZoomInButton } from './components/ZoomInButton';
import { ZoomOutButton } from './components/ZoomOutButton';

const PdfViewer = lazy(() => import('./components/PdfViewer'));

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

      <Suspense fallback={<PdfViewerSkeleton />}>
        <PdfViewer />
      </Suspense>
    </div>
  );
};

export default PdfManager;
