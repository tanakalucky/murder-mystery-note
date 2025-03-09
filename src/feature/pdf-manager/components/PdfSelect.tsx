import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePdfStore } from '@/store/pdf-store';

export const PdfSelect = () => {
  const pdfs = usePdfStore((state) => state.pdfs);
  const currentPdf = usePdfStore((state) => state.currentPdf);
  const setCurrentPdf = usePdfStore((state) => state.setCurrentPdf);

  return (
    <div className="flex-1 mr-2">
      <Select value={currentPdf?.id || ''} onValueChange={(value) => setCurrentPdf(value)}>
        <SelectTrigger className="w-full" disabled={pdfs.length === 0}>
          <SelectValue placeholder="PDFを選択" />
        </SelectTrigger>

        {pdfs.length > 0 && (
          <SelectContent>
            {pdfs.map((pdf) => (
              <SelectItem key={pdf.id} value={pdf.id}>
                {pdf.name}
              </SelectItem>
            ))}
          </SelectContent>
        )}
      </Select>
    </div>
  );
};
