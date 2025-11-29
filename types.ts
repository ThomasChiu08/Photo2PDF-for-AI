export interface ReportItem {
  id: number;
  description: string;
  image: File | null;
  imagePreviewUrl: string | null;
}

export interface PDFGenerationState {
  isGenerating: boolean;
  error: string | null;
}
