import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const [imageRow, titleRow] = [...block.children];

  // Create image wrapper
  const imageDiv = document.createElement('div');
  imageDiv.className = 'banner-image';

  if (imageRow) {
    const picture = imageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPicture = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1200' }]);
      imageDiv.append(optimizedPicture);
    }
  }

  // Create content wrapper
  const contentDiv = document.createElement('div');
  contentDiv.className = 'banner-content';

  if (titleRow) {
    while (titleRow.firstElementChild) {
      contentDiv.append(titleRow.firstElementChild);
    }
  }

  block.replaceChildren(imageDiv, contentDiv);
}
