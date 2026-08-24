/* global WebImporter */

/**
 * Import transform for the "Our Team" page.
 *
 * Produces default text content plus an Employee List block whose single cell
 * holds a link to the published employees spreadsheet JSON.
 */

const buildMetadata = (main, document) => {
  const meta = {};
  const title = document.querySelector('title');
  if (title) meta.Title = title.textContent.trim();
  const desc = document.querySelector('meta[name="description"]');
  if (desc) meta.Description = desc.getAttribute('content');
  const block = WebImporter.Blocks.getMetadataBlock(document, meta);
  main.append(block);
};

export default {
  transformDOM: ({ document }) => {
    const source = document.querySelector('main') || document.body;
    const main = document.createElement('main');

    // Intro (default text content)
    const intro = source.querySelector('.intro');
    if (intro) main.append(...intro.childNodes);
    main.append(document.createElement('hr'));

    // Employee List block — single cell with a link to the JSON source
    const team = source.querySelector('.employee-list-component');
    const link = team && team.querySelector('a');
    if (link) {
      main.append(WebImporter.DOMUtils.createTable([
        ['Employee List'],
        [link],
      ], document));
    }
    main.append(document.createElement('hr'));

    buildMetadata(main, document);
    return main;
  },

  generateDocumentPath: () => '/employees',
};
