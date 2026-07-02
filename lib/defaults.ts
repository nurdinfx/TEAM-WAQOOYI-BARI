import type { ContentData } from "./types";
import {
  siteSettings,
  leaders,
  members,
  books,
  events,
  galleryItems,
  articles,
  sponsors,
  paymentChannels,
  bookCategories,
} from "./data";

export function getDefaultContent(): ContentData {
  return {
    settings: siteSettings,
    leaders,
    members,
    books,
    events,
    galleryItems,
    articles,
    sponsors,
    paymentChannels,
    donations: [],
    bookCategories,
    subscribers: [],
  };
}