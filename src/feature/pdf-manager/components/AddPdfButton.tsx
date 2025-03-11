import { Button } from '@/components/ui/button';
import { usePdfStore } from '@/store/pdf-store';
import { FileUp } from 'lucide-react';
import { useRef } from 'react';

type AddPdfButtonProps = React.ComponentProps<'button'>;

const AddPdfButton = ({ ...props }: AddPdfButtonProps) => {
  const addPdf = usePdfStore((state) => state.addPdf);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      addPdf(files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        title="PDFファイルをアップロード"
        {...props}
      >
        <FileUp className="h-4 w-4" />
      </Button>

      <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
    </>
  );
};

export default AddPdfButton;
