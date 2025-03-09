import { create } from 'zustand';

export const ZOOM_IN_STEP = 0.1;
export const ZOOM_OUT_STEP = 0.1;
export const ZOOM_MAX = 5.0;
export const ZOOM_MIN = 0.1;

export interface PDFDocument {
  id: string;
  name: string;
  file: File;
  url: string;
  scale: number;
  scrollTop: number;
}

interface PDFState {
  pdfs: PDFDocument[];
  currentPdf: PDFDocument | null;
  addPdf: (file: File) => void;
  removePdf: (id: string) => void;
  setCurrentPdf: (id: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  updateScrollPosition: (id: string, position: { top: number }) => void;
}

export const usePdfStore = create<PDFState>((set, get) => ({
  pdfs: [],
  currentPdf: null,
  addPdf: (file: File) => {
    const id = Date.now().toString();
    const url = URL.createObjectURL(file);

    set((state) => ({
      pdfs: [...state.pdfs, { id, name: file.name, file, url, scale: 1, scrollTop: 0 }],
      currentPdf:
        state.pdfs.length === 0 ? { id, name: file.name, file, url, scale: 1, scrollTop: 0 } : state.currentPdf || null,
    }));
  },

  removePdf: (id: string) => {
    const { pdfs, currentPdf } = get();
    const pdfToRemove = pdfs.find((pdf) => pdf.id === id);

    if (pdfToRemove) {
      URL.revokeObjectURL(pdfToRemove.url); // メモリリーク防止
    }

    const newPdfs = pdfs.filter((pdf) => pdf.id !== id);
    const newCurrentId = id === currentPdf?.id ? (newPdfs.length > 0 ? newPdfs[0].id : null) : currentPdf?.id;

    set({
      pdfs: newPdfs,
      currentPdf: newCurrentId ? newPdfs.find((pdf) => pdf.id === newCurrentId) || null : null,
    });
  },

  setCurrentPdf: (id: string) => {
    set({ currentPdf: get().pdfs.find((pdf) => pdf.id === id) || null });
  },

  zoomIn: () => {
    set((state) => {
      if (!state.currentPdf) return state;

      const newScale = Math.min(ZOOM_MAX, state.currentPdf.scale + ZOOM_IN_STEP);
      const updatedPdfs = state.pdfs.map((pdf) =>
        pdf.id === state.currentPdf?.id ? { ...pdf, scale: newScale } : pdf,
      );

      return {
        pdfs: updatedPdfs,
        currentPdf: { ...state.currentPdf, scale: newScale },
      };
    });
  },

  zoomOut: () => {
    set((state) => {
      if (!state.currentPdf) return state;

      const newScale = Math.max(ZOOM_MIN, state.currentPdf.scale - ZOOM_OUT_STEP);
      const updatedPdfs = state.pdfs.map((pdf) =>
        pdf.id === state.currentPdf?.id ? { ...pdf, scale: newScale } : pdf,
      );

      return {
        pdfs: updatedPdfs,
        currentPdf: { ...state.currentPdf, scale: newScale },
      };
    });
  },
  updateScrollPosition: (id: string, position: { top: number }) => {
    set((state) => {
      const updatedPdfs = state.pdfs.map((pdf) => (pdf.id === id ? { ...pdf, scrollTop: position.top } : pdf));
      const updatedCurrentPdf =
        state.currentPdf?.id === id ? { ...state.currentPdf, scrollTop: position.top } : state.currentPdf;

      return {
        pdfs: updatedPdfs,
        currentPdf: updatedCurrentPdf,
      };
    });
  },
}));
