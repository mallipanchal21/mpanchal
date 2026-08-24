/* global WebImporter */

/**
 * Import transform for the "Content Types" page.
 *
 * Produces one AEM page that exercises every core content type:
 *   1. Text     — headings, paragraphs, inline formatting, lists (default content)
 *   2. Image    — a standalone image (default content)
 *   3. Video    — a YouTube link converted into an Embed block
 *   4. Links    — inline and standalone links (default content)
 *   5. Section  — a styled section using a Section Metadata block
 *   6. Block    — a Banner block
 *
 * Sections are separated with <hr> so each renders as its own AEM section.
 */

const appendSectionBreak = (main, document) => {
  main.append(document.createElement('hr'));
};

const buildMetadata = (main, document) => {
  const title = document.querySelector('title');
  const desc = document.querySelector('meta[name="description"], meta[property="og:description"]');

  // Image cell holds an actual <img> element so the pipeline emits og:image.
  const imgMeta = document.querySelector('meta[property="og:image"]');
  const img = document.createElement('img');
  img.src = imgMeta
    ? imgMeta.getAttribute('content')
    : 'https://main--eds-demo--mkbansal1.aem.live/media_17442c8974f4d71d45ec2720c303432d9ced329cc.jpg';
  img.alt = 'Content Types social share image';

  // Full metadata block: Title, Description, Image, Theme, Template, Tags.
  const cells = [
    ['Metadata'],
    ['Title', title ? title.textContent.trim() : ''],
    ['Description', desc ? desc.getAttribute('content') : ''],
    ['Image', img],
    ['Theme', 'light'],
    ['Template', 'content-types'],
    ['Tags', 'AEM, Edge Delivery, Content Types, Demo'],
  ];
  main.append(WebImporter.DOMUtils.createTable(cells, document));
};

export default {
  transformDOM: ({ document }) => {
    const source = document.querySelector('main') || document.body;
    const main = document.createElement('main');

    // --- Section 1: Text ---
    const intro = source.querySelector('.intro');
    if (intro) main.append(...intro.childNodes);
    appendSectionBreak(main, document);

    // --- Section 2: Image ---
    const media = source.querySelector('.media');
    if (media) main.append(...media.childNodes);
    appendSectionBreak(main, document);

    // --- Section 3: Video (Embed block) ---
    const video = source.querySelector('.video');
    if (video) {
      const heading = video.querySelector('h2');
      const link = video.querySelector('a');
      const lead = [...video.querySelectorAll('p')].find((p) => !p.contains(link));
      if (heading) main.append(heading);
      if (lead) main.append(lead);
      main.append(WebImporter.DOMUtils.createTable([
        ['Embed'],
        [link],
      ], document));
    }
    appendSectionBreak(main, document);

    // --- Section 4: Links ---
    const links = source.querySelector('.links');
    if (links) main.append(...links.childNodes);
    appendSectionBreak(main, document);

    // --- Section 5: Styled Section (Section Metadata block) ---
    const callout = source.querySelector('.callout');
    if (callout) {
      main.append(...callout.childNodes);
      main.append(WebImporter.DOMUtils.createTable([
        ['Section Metadata'],
        ['Style', 'highlight'],
      ], document));
    }
    appendSectionBreak(main, document);

    // --- Section 6: Block (Banner) ---
    const bannerRegion = source.querySelector('.banner-region');
    if (bannerRegion) {
      const heading = bannerRegion.querySelector('h2');
      const lead = bannerRegion.querySelector(':scope > p');
      if (heading) main.append(heading);
      if (lead) main.append(lead);

      const component = bannerRegion.querySelector('.banner-component');
      const img = component.querySelector('img');
      const title = component.querySelector('p');
      // Banner block: row 1 = image, row 2 = title/content
      main.append(WebImporter.DOMUtils.createTable([
        ['Banner'],
        [img],
        [title],
      ], document));
    }
    appendSectionBreak(main, document);

    // --- Page metadata (own trailing section) ---
    buildMetadata(main, document);

    return main;
  },

  generateDocumentPath: () => '/content-types',
};
