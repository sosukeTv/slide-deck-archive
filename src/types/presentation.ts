export interface PresentationMeta {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  category: 'Security' | 'Life' | 'Tech' | 'Trends';
  author: string;
  description: string;
  tags: string[];
  youtubeId?: string;
  youtubeTitle?: string;
  thumbnail: string;
  slidesCount?: number;
}

export interface PresentationData {
  meta: PresentationMeta;
  rawMarkdown: string;
  slides: string[];
}
