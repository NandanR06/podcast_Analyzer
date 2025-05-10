export interface KeyPoint {
  title: string;
  content: string;
}

export interface SummaryData {
  text: string;
  audioSummaryUrl: string | null;
  keyPoints: KeyPoint[];
  pdfUrl?: string;
  transcription : string | null
}
