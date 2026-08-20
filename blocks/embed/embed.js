/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.aem.live/developer/block-collection/embed
 */

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) script.setAttribute('type', type);
  script.onload = callback;
  head.append(script);
  return script;
};

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedYoutube = (url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  let suffix = '';
  if (autoplay) {
    usp.set('autoplay', '1');
    usp.set('mute', '1');
    suffix = '&muted=1&autoplay=1';
  }
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const embedTwitter = (url) => {
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
};

const loadEmbedMarkup = (block, markup) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }
  block.innerHTML = markup;
  block.classList = 'block embed embed-markup';
  block.classList.add('embed-is-loaded');
};

const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
    {
      match: ['twitter', 'x.com'],
      embed: embedTwitter,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url, autoplay);
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed embed-default';
  }
  block.classList.add('embed-is-loaded');
};

export default async function decorate(block) {
  // Authors can provide either a URL (link/text) that we transform into an
  // embed, or raw HTML markup (e.g. a full <iframe>/<blockquote>) that we
  // render as-is. Detect embeddable markup so pasted iframes just work.
  const markupEl = block.querySelector('iframe, blockquote, embed, object, video');
  const link = block.querySelector('a');

  if (markupEl && !link) {
    const markup = block.innerHTML;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadEmbedMarkup(block, markup);
      }
    });
    observer.observe(block);
    return;
  }

  const url = link ? link.href : block.textContent.trim();

  block.textContent = '';
  block.dataset.embedLoad = url;

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      loadEmbed(block, url);
    }
  });
  observer.observe(block);
}
