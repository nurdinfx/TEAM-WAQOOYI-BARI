export interface Leader {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Member {
  id: string;
  name: string;
  role: string;
  level: string;
  image: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  dateRead: string;
  rating: number;
  summary: string;
  category: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  isUpcoming: boolean;
}

export interface GalleryItem {
  id: string;
  type: "photo" | "video";
  src: string;
  thumbnail?: string;
  caption: string;
  date: string;
}

export interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  cover: string;
  published: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  logo?: string;
}

export interface PaymentChannel {
  id: string;
  name: string;
  code: string;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  channel: string;
  date: string;
  note?: string;
}

export interface ContentData {
  settings: SiteSettings;
  leaders: Leader[];
  members: Member[];
  books: Book[];
  events: Event[];
  galleryItems: GalleryItem[];
  articles: Article[];
  sponsors: Sponsor[];
  paymentChannels: PaymentChannel[];
  donations: Donation[];
  bookCategories: string[];
  subscribers: NewsletterSubscriber[];
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroBadge: string;
  fundraisingGoal: number;
  fundraisingProgress: number;
  stats: {
    members: number;
    books: number;
    events: number;
    awards: number;
  };
  contact: {
    whatsapp: string;
    facebook: string;
    email: string;
    mapLat: number;
    mapLng: number;
  };
  about: string;
  autoSyncStats?: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  date: string;
}
