# Requirements Document

## Introduction

Waqooyi Bari Team is a community reading and writing group. This document defines the requirements for a full public-facing website and a custom admin dashboard to manage all content. The website serves as the digital home for the team — presenting its leadership, members, books library, events, gallery, news, and fundraising efforts to the public, while providing administrators with a secure, easy-to-use panel to manage all content without touching code.

The site will be built with Next.js 15, TypeScript, TailwindCSS, Framer Motion, GSAP, Lenis Smooth Scroll, Supabase (PostgreSQL), Cloudinary for file storage, and Clerk or Supabase Auth for admin authentication.

---

## Glossary

- **Website**: The public-facing Next.js web application accessible to all visitors.
- **Admin Panel**: The restricted dashboard accessible only to authenticated administrators.
- **Administrator**: An authenticated user with permission to create, update, and delete content via the Admin Panel.
- **Visitor**: An unauthenticated user browsing the public Website.
- **Hero Section**: The large banner area at the top of the Home page containing animated text and a background visual.
- **Counter**: An animated numeric display showing a statistic (e.g., number of members, books read).
- **Leader**: A named individual displayed on the Leadership page with a photo, title, and bio.
- **Member**: A named individual displayed on the Members page with a photo, job/role, and membership level.
- **Book**: An entry in the Books Library with a cover image, title, author, date read, star rating, and summary.
- **Event**: A scheduled or past gathering of the team with a title, date, description, and optional photos or videos.
- **Article**: A blog post or news item authored by the team and published on the News & Articles page.
- **Gallery_Item**: A photo or video displayed in the Gallery section.
- **Donation**: A financial contribution made through the Support Us page via one of the supported payment channels.
- **Sponsor**: An organisation or individual featured on the Support Us page as a financial supporter.
- **Payment_Channel**: One of the supported payment methods: EVC Plus, Zaad, Sahal, Premier Bank, or Stripe.
- **Fundraising_Goal**: The total monetary target for a fundraising campaign displayed on the Support Us page.
- **Fundraising_Progress**: The current amount raised toward the Fundraising_Goal.
- **Cloudinary**: The third-party service used to store and serve uploaded images and videos.
- **Supabase**: The backend-as-a-service providing the PostgreSQL database and optional authentication.
- **Clerk**: The optional third-party authentication provider for administrator accounts.

---

## Requirements

### Requirement 1: Home Page — Hero Section

**User Story:** As a Visitor, I want to see an engaging hero section when I first land on the site, so that I immediately understand who Waqooyi Bari Team is and feel welcomed.

#### Acceptance Criteria

1. THE Website SHALL display a Hero Section on the Home page that contains the text "Waqooyi Bari Team" with a typing/text animation effect.
2. THE Website SHALL display the subtitle text "Bulsho ku mideysan Akhriska iyo Qoraalka" in the Hero Section with a typing/text animation effect.
3. WHEN the Home page loads, THE Website SHALL begin the hero text animation within 500ms of the page becoming interactive.
4. THE Website SHALL display either a looping background video or an automatically changing sequence of images behind the Hero Section text.
5. WHEN a background image sequence is used, THE Website SHALL transition between images at an interval between 4 seconds and 8 seconds using a smooth crossfade animation.
6. THE Administrator SHALL be able to update the hero text content and background media via the Admin Panel without redeploying the application.

---

### Requirement 2: Home Page — Statistics Counters

**User Story:** As a Visitor, I want to see key statistics about the team on the Home page, so that I can quickly grasp the team's size and activity level.

#### Acceptance Criteria

1. THE Website SHALL display at minimum three Counter elements on the Home page: total number of Members, total number of Books read, and total number of Events held.
2. WHEN a Counter element enters the visible viewport during scroll, THE Website SHALL animate the counter from zero to its current value over a duration between 1 second and 3 seconds.
3. THE Website SHALL derive Counter values dynamically from the database so that they reflect the current number of Members, Books, and Events stored in Supabase.
4. THE Administrator SHALL be able to override Counter values with manually entered numbers via the Admin Panel Settings page.

---

### Requirement 3: About Team Page

**User Story:** As a Visitor, I want to read about the Waqooyi Bari Team's mission and history, so that I can understand the group's purpose and values.

#### Acceptance Criteria

1. THE Website SHALL display an About Team page containing a text description of the team's mission, history, and values.
2. THE Administrator SHALL be able to edit the About Team page body text via the Admin Panel Settings page.
3. WHEN the About Team page is loaded, THE Website SHALL apply scroll-reveal animations to each content section as it enters the viewport.

---

### Requirement 4: Leadership Page

**User Story:** As a Visitor, I want to view the team's leadership with photos and titles, so that I know who leads the organisation.

#### Acceptance Criteria

1. THE Website SHALL display a Leadership page listing all Leaders stored in the database.
2. FOR EACH Leader, THE Website SHALL display the Leader's photo, full name, title (e.g., Chairman, Secretary), and a short bio.
3. WHEN a Leader's photo fails to load, THE Website SHALL display a placeholder avatar image in its place.
4. THE Administrator SHALL be able to add a new Leader via the Admin Panel by providing a photo, full name, title, and bio.
5. THE Administrator SHALL be able to edit an existing Leader's photo, name, title, or bio via the Admin Panel.
6. THE Administrator SHALL be able to delete a Leader from the Admin Panel, which permanently removes the Leader from the database and the public Leadership page.
7. WHEN the Leadership page is loaded, THE Website SHALL apply scroll-reveal animations to each Leader card as it enters the viewport.

---

### Requirement 5: Members Page

**User Story:** As a Visitor, I want to browse the team's members with their photos and roles, so that I can see who is part of the community.

#### Acceptance Criteria

1. THE Website SHALL display a Members page listing all Members stored in the database.
2. FOR EACH Member, THE Website SHALL display the Member's photo, full name, job or role, and membership level.
3. WHEN a Member's photo fails to load, THE Website SHALL display a placeholder avatar image in its place.
4. THE Administrator SHALL be able to add a new Member via the Admin Panel by providing a photo, full name, job/role, and membership level.
5. THE Administrator SHALL be able to edit an existing Member's photo, name, job/role, or membership level via the Admin Panel.
6. THE Administrator SHALL be able to delete a Member from the Admin Panel, which permanently removes the Member from the database and the public Members page.

---

### Requirement 6: Books Library Page

**User Story:** As a Visitor, I want to explore books the team has read with ratings and summaries, so that I can discover reading recommendations and track the team's literary activity.

#### Acceptance Criteria

1. THE Website SHALL display a Books Library page listing all Books stored in the database.
2. FOR EACH Book, THE Website SHALL display the Book's cover image, title, author, date read, star rating (an integer from 1 to 5), and short summary.
3. THE Website SHALL display the star rating for each Book using a visual five-star icon representation.
4. THE Website SHALL provide a text search input on the Books Library page that filters the displayed Books by title or author as the Visitor types, returning results within 300ms of the last keystroke.
5. THE Website SHALL provide category filters on the Books Library page so that a Visitor can filter Books by a predefined category tag.
6. WHEN no Books match the active search or filter, THE Website SHALL display a "No books found" message.
7. WHEN a Book's cover image fails to load, THE Website SHALL display a placeholder book cover image in its place.
8. THE Website SHALL apply a 3D hover animation to each Book card when a Visitor hovers over it on non-touch devices.
9. THE Administrator SHALL be able to add a new Book via the Admin Panel by providing a cover image, title, author, date read, star rating, summary, and category.
10. THE Administrator SHALL be able to edit an existing Book's details via the Admin Panel.
11. THE Administrator SHALL be able to delete a Book from the Admin Panel, which permanently removes the Book from the database and the public Books Library page.

---

### Requirement 7: Events Page

**User Story:** As a Visitor, I want to view past and upcoming events organised by the team, so that I can stay informed about the team's activities and discussions.

#### Acceptance Criteria

1. THE Website SHALL display an Events page listing all Events stored in the database.
2. FOR EACH Event, THE Website SHALL display the Event's title, date, description, and any associated photos or videos.
3. THE Website SHALL visually distinguish upcoming Events from past Events on the Events page.
4. THE Website SHALL display Events in reverse chronological order by default, with the most recent or soonest Event appearing first.
5. THE Website SHALL render the Events timeline using an animated timeline component with scroll-reveal animations.
6. THE Administrator SHALL be able to add a new Event via the Admin Panel by providing a title, date, description, and optional photos or videos.
7. THE Administrator SHALL be able to edit an existing Event's details via the Admin Panel.
8. THE Administrator SHALL be able to delete an Event from the Admin Panel, which permanently removes the Event from the database and the public Events page.

---

### Requirement 8: Gallery Page

**User Story:** As a Visitor, I want to browse a gallery of event photos and videos, so that I can see the team's activities and feel connected to the community.

#### Acceptance Criteria

1. THE Website SHALL display a Gallery page containing all Gallery_Items stored in the database.
2. THE Website SHALL support two types of Gallery_Items: photos and videos.
3. FOR EACH photo Gallery_Item, THE Website SHALL display the image in a grid layout with a hover animation effect that reveals the item's caption or title.
4. FOR EACH video Gallery_Item, THE Website SHALL display a video thumbnail with a play button overlay; WHEN a Visitor clicks the play button, THE Website SHALL play the video within a modal or inline player.
5. THE Website SHALL provide a filter control on the Gallery page allowing Visitors to view all items, photos only, or videos only.
6. THE Administrator SHALL be able to add a new Gallery_Item via the Admin Panel by uploading a photo or video file along with a caption and date.
7. THE Administrator SHALL be able to delete a Gallery_Item from the Admin Panel, which permanently removes the item from Cloudinary and the database.

---

### Requirement 9: News & Articles Page

**User Story:** As a Visitor, I want to read blog posts and news articles published by the team, so that I can stay updated on team activities and ideas.

#### Acceptance Criteria

1. THE Website SHALL display a News & Articles page listing all published Articles stored in the database.
2. FOR EACH Article, THE Website SHALL display a cover image, title, author name, publication date, and a short excerpt on the listing page.
3. WHEN a Visitor clicks on an Article, THE Website SHALL navigate to a dedicated Article detail page displaying the full Article content.
4. THE Website SHALL render Article body content as rich text supporting headings, paragraphs, bullet lists, bold, italic, and embedded images.
5. THE Website SHALL display Articles in reverse chronological order by publication date.
6. THE Administrator SHALL be able to create a new Article via the Admin Panel by providing a cover image, title, author name, publication date, body content (rich text), and a published/draft status flag.
7. WHEN an Article has a draft status, THE Website SHALL NOT display it on the public News & Articles page.
8. THE Administrator SHALL be able to edit an existing Article's content or status via the Admin Panel.
9. THE Administrator SHALL be able to delete an Article from the Admin Panel, which permanently removes the Article from the database and the public News & Articles page.

---

### Requirement 10: Support Us Page

**User Story:** As a Visitor, I want to support the Waqooyi Bari Team financially, so that I can contribute to the team's sustainability and growth.

#### Acceptance Criteria

1. THE Website SHALL display a Support Us page containing a "Become a Sponsor" section that lists current Sponsors with their names and optional logos.
2. THE Website SHALL display a fundraising progress bar on the Support Us page showing the Fundraising_Progress as a percentage of the Fundraising_Goal.
3. THE Website SHALL display the current Fundraising_Progress amount and the Fundraising_Goal amount in text alongside the progress bar (e.g., "Waxaan ururinay $2,350 oo ka mid ah $10,000").
4. THE Website SHALL display donation instructions for each Payment_Channel: EVC Plus, Zaad, Sahal, and Premier Bank, including the relevant account number or payment code.
5. WHERE Stripe is configured as a Payment_Channel, THE Website SHALL provide an online donation form that accepts a donor-specified amount in USD and processes the payment via the Stripe API.
6. WHEN a Stripe payment is successfully processed, THE Website SHALL display a confirmation message to the Visitor and THE System SHALL record the Donation in the database.
7. WHEN a Stripe payment fails, THE Website SHALL display a descriptive error message to the Visitor without exposing internal error details.
8. THE Administrator SHALL be able to update the Fundraising_Goal and Fundraising_Progress values via the Admin Panel.
9. THE Administrator SHALL be able to add, edit, or remove Sponsors via the Admin Panel.

---

### Requirement 11: Contact Page

**User Story:** As a Visitor, I want to find the team's contact information in one place, so that I can reach out via my preferred channel.

#### Acceptance Criteria

1. THE Website SHALL display a Contact page containing the team's WhatsApp number as a clickable link that opens WhatsApp with a pre-filled greeting.
2. THE Website SHALL display the team's Facebook page URL as a clickable link that opens the Facebook page in a new browser tab.
3. THE Website SHALL display the team's email address as a clickable mailto link.
4. THE Website SHALL embed an interactive Google Maps widget on the Contact page showing the team's location.
5. THE Administrator SHALL be able to update all contact details (WhatsApp number, Facebook URL, email address, and map coordinates) via the Admin Panel Settings page.

---

### Requirement 12: Site-Wide Animations and Transitions

**User Story:** As a Visitor, I want the website to feel polished and engaging through smooth animations, so that the experience matches the team's creative and cultural identity.

#### Acceptance Criteria

1. THE Website SHALL use Lenis Smooth Scroll to provide inertia-based smooth scrolling on all pages.
2. THE Website SHALL display a branded loading screen animation when any page is first loading and SHALL hide the loading screen once the page content is ready.
3. THE Website SHALL apply smooth animated transitions between pages when a Visitor navigates from one page to another using Next.js route transitions powered by Framer Motion.
4. THE Website SHALL display floating particle animations in the background of the Hero Section.
5. WHEN a Visitor navigates between pages, THE Website SHALL complete the page transition animation within 600ms.

---

### Requirement 13: Admin Panel — Authentication

**User Story:** As an Administrator, I want to securely log in to the Admin Panel, so that only authorised people can manage the website content.

#### Acceptance Criteria

1. THE Admin Panel SHALL be accessible only to authenticated Administrators.
2. WHEN an unauthenticated user attempts to access any Admin Panel route, THE Admin Panel SHALL redirect the user to the login page.
3. THE Admin Panel SHALL support email and password-based login via Clerk or Supabase Auth.
4. WHEN an Administrator provides an incorrect email or password, THE Admin Panel SHALL display an error message and SHALL NOT grant access.
5. THE Admin Panel SHALL provide a logout action that terminates the Administrator's session and redirects to the login page.
6. WHEN an Administrator's session expires, THE Admin Panel SHALL redirect the Administrator to the login page.

---

### Requirement 14: Admin Panel — Dashboard

**User Story:** As an Administrator, I want a dashboard overview when I log in, so that I can quickly see the state of the website content.

#### Acceptance Criteria

1. THE Admin Panel SHALL display a Dashboard page as the default page after login.
2. THE Dashboard SHALL display summary counts for: Leaders, Members, Books, Gallery_Items, Events, Articles, and Donations.
3. THE Dashboard SHALL display a list of the five most recently added or updated items across all content types.

---

### Requirement 15: Admin Panel — Content Management

**User Story:** As an Administrator, I want to manage all website content from a single admin panel, so that I can keep the public site up-to-date without developer assistance.

#### Acceptance Criteria

1. THE Admin Panel SHALL provide dedicated management pages for each content type: Leaders, Members, Books, Gallery, Events, Articles, Donations, and Settings.
2. FOR EACH content management page, THE Admin Panel SHALL display all existing items in a paginated table or grid with at minimum 20 items per page.
3. THE Admin Panel SHALL provide a "Create" action on each content management page that opens a form for adding a new item of that content type.
4. THE Admin Panel SHALL provide an "Edit" action for each listed item that opens a pre-filled form with the item's current data.
5. THE Admin Panel SHALL provide a "Delete" action for each listed item.
6. WHEN an Administrator selects "Delete" for any item, THE Admin Panel SHALL display a confirmation dialog before permanently deleting the item.
7. WHEN an Administrator uploads an image or video via any Admin Panel form, THE Admin Panel SHALL upload the file to Cloudinary and store the resulting URL in the database.
8. IF a Cloudinary upload fails, THEN THE Admin Panel SHALL display an error message and SHALL NOT save the item to the database.
9. THE Admin Panel SHALL validate all required form fields before submission and display field-level error messages for any missing or invalid values.

---

### Requirement 16: Admin Panel — Settings

**User Story:** As an Administrator, I want a Settings page to control global site configuration, so that I can update site-wide content without editing code.

#### Acceptance Criteria

1. THE Admin Panel Settings page SHALL allow the Administrator to edit the hero section text and background media.
2. THE Admin Panel Settings page SHALL allow the Administrator to edit the About Team page content.
3. THE Admin Panel Settings page SHALL allow the Administrator to update contact details: WhatsApp number, Facebook URL, email address, and Google Maps coordinates.
4. THE Admin Panel Settings page SHALL allow the Administrator to update the Fundraising_Goal and Fundraising_Progress values.
5. THE Admin Panel Settings page SHALL allow the Administrator to override the Counter values displayed on the Home page.
6. WHEN the Administrator saves any setting, THE Admin Panel SHALL store the updated value in the database and THE Website SHALL reflect the change on the next page load.

---

### Requirement 17: Responsive Design

**User Story:** As a Visitor using any device, I want the website to display correctly on my screen, so that I can comfortably browse the content on mobile, tablet, or desktop.

#### Acceptance Criteria

1. THE Website SHALL render correctly at viewport widths of 320px, 768px, and 1280px without horizontal overflow or broken layouts.
2. THE Website SHALL use a mobile-first responsive layout using TailwindCSS breakpoints.
3. THE Website SHALL adapt the navigation menu to a hamburger/drawer menu on viewport widths below 768px.
4. THE Website SHALL scale all images proportionally and avoid fixed pixel widths that cause overflow on small screens.

---

### Requirement 18: Performance and Accessibility

**User Story:** As a Visitor, I want pages to load quickly and be accessible, so that the experience is usable regardless of connection speed or accessibility needs.

#### Acceptance Criteria

1. THE Website SHALL achieve a Google Lighthouse Performance score of 70 or above on desktop for all public pages.
2. THE Website SHALL use Next.js Image optimisation (next/image) for all user-uploaded images served from Cloudinary.
3. THE Website SHALL provide descriptive alt text for all meaningful images; THE Administrator SHALL be able to set alt text when uploading images via the Admin Panel.
4. THE Website SHALL achieve a Google Lighthouse Accessibility score of 80 or above on desktop for all public pages.
5. THE Website SHALL ensure all interactive elements (links, buttons, form inputs) are keyboard-navigable and have visible focus indicators.
