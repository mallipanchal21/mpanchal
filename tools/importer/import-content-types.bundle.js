/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-content-types.js
  var import_content_types_exports = {};
  __export(import_content_types_exports, {
    default: () => import_content_types_default
  });
  var appendSectionBreak = (main, document) => {
    main.append(document.createElement("hr"));
  };
  var buildMetadata = (main, document) => {
    const title = document.querySelector("title");
    const desc = document.querySelector('meta[name="description"], meta[property="og:description"]');
    const imgMeta = document.querySelector('meta[property="og:image"]');
    const img = document.createElement("img");
    img.src = imgMeta ? imgMeta.getAttribute("content") : "https://main--eds-demo--mkbansal1.aem.live/media_17442c8974f4d71d45ec2720c303432d9ced329cc.jpg";
    img.alt = "Content Types social share image";
    const cells = [
      ["Metadata"],
      ["Title", title ? title.textContent.trim() : ""],
      ["Description", desc ? desc.getAttribute("content") : ""],
      ["Image", img],
      ["Theme", "light"],
      ["Template", "content-types"],
      ["Tags", "AEM, Edge Delivery, Content Types, Demo"]
    ];
    main.append(WebImporter.DOMUtils.createTable(cells, document));
  };
  var import_content_types_default = {
    transformDOM: ({ document }) => {
      const source = document.querySelector("main") || document.body;
      const main = document.createElement("main");
      const intro = source.querySelector(".intro");
      if (intro) main.append(...intro.childNodes);
      appendSectionBreak(main, document);
      const media = source.querySelector(".media");
      if (media) main.append(...media.childNodes);
      appendSectionBreak(main, document);
      const video = source.querySelector(".video");
      if (video) {
        const heading = video.querySelector("h2");
        const link = video.querySelector("a");
        const lead = [...video.querySelectorAll("p")].find((p) => !p.contains(link));
        if (heading) main.append(heading);
        if (lead) main.append(lead);
        main.append(WebImporter.DOMUtils.createTable([
          ["Embed"],
          [link]
        ], document));
      }
      appendSectionBreak(main, document);
      const links = source.querySelector(".links");
      if (links) main.append(...links.childNodes);
      appendSectionBreak(main, document);
      const callout = source.querySelector(".callout");
      if (callout) {
        main.append(...callout.childNodes);
        main.append(WebImporter.DOMUtils.createTable([
          ["Section Metadata"],
          ["Style", "highlight"]
        ], document));
      }
      appendSectionBreak(main, document);
      const bannerRegion = source.querySelector(".banner-region");
      if (bannerRegion) {
        const heading = bannerRegion.querySelector("h2");
        const lead = bannerRegion.querySelector(":scope > p");
        if (heading) main.append(heading);
        if (lead) main.append(lead);
        const component = bannerRegion.querySelector(".banner-component");
        const img = component.querySelector("img");
        const title = component.querySelector("p");
        main.append(WebImporter.DOMUtils.createTable([
          ["Banner"],
          [img],
          [title]
        ], document));
      }
      appendSectionBreak(main, document);
      buildMetadata(main, document);
      return main;
    },
    generateDocumentPath: () => "/content-types"
  };
  return __toCommonJS(import_content_types_exports);
})();
