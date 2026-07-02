import type { ContentData } from "./types";

export function deepMergeContent(
  defaults: ContentData,
  parsed: Partial<ContentData>
): ContentData {
  return {
    settings: {
      ...defaults.settings,
      ...parsed.settings,
      stats: {
        ...defaults.settings.stats,
        ...parsed.settings?.stats,
      },
      contact: {
        ...defaults.settings.contact,
        ...parsed.settings?.contact,
      },
    },
    leaders: parsed.leaders ?? defaults.leaders,
    members: parsed.members ?? defaults.members,
    books: parsed.books ?? defaults.books,
    events: parsed.events ?? defaults.events,
    galleryItems: parsed.galleryItems ?? defaults.galleryItems,
    articles: parsed.articles ?? defaults.articles,
    sponsors: parsed.sponsors ?? defaults.sponsors,
    paymentChannels: parsed.paymentChannels ?? defaults.paymentChannels,
    donations: parsed.donations ?? defaults.donations,
    bookCategories: parsed.bookCategories ?? defaults.bookCategories,
    subscribers: parsed.subscribers ?? defaults.subscribers ?? [],
  };
}

/** Sync statistics and fundraising from real stored data */
export function enrichContent(content: ContentData): ContentData {
  const autoSync = content.settings.autoSyncStats !== false;
  const donationTotal = content.donations.reduce((sum, d) => sum + d.amount, 0);

  if (!autoSync) {
    return content;
  }

  return {
    ...content,
    settings: {
      ...content.settings,
      stats: {
        members: content.members.length,
        books: content.books.length,
        events: content.events.length,
        awards: content.settings.stats.awards,
      },
      fundraisingProgress:
        donationTotal > 0 ? donationTotal : content.settings.fundraisingProgress,
    },
  };
}

export function validateContent(content: ContentData): string | null {
  if (!content.settings?.heroTitle?.trim()) return "Hero title is required";
  if (!Array.isArray(content.leaders)) return "Leaders must be an array";
  if (!Array.isArray(content.members)) return "Members must be an array";
  if (!Array.isArray(content.books)) return "Books must be an array";
  return null;
}
