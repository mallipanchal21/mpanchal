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

  // tools/importer/import-employees.js
  var import_employees_exports = {};
  __export(import_employees_exports, {
    default: () => import_employees_default
  });
  var buildMetadata = (main, document) => {
    const meta = {};
    const title = document.querySelector("title");
    if (title) meta.Title = title.textContent.trim();
    const desc = document.querySelector('meta[name="description"]');
    if (desc) meta.Description = desc.getAttribute("content");
    const block = WebImporter.Blocks.getMetadataBlock(document, meta);
    main.append(block);
  };
  var import_employees_default = {
    transformDOM: ({ document }) => {
      const source = document.querySelector("main") || document.body;
      const main = document.createElement("main");
      const intro = source.querySelector(".intro");
      if (intro) main.append(...intro.childNodes);
      main.append(document.createElement("hr"));
      const team = source.querySelector(".employee-list-component");
      const link = team && team.querySelector("a");
      if (link) {
        main.append(WebImporter.DOMUtils.createTable([
          ["Employee List"],
          [link]
        ], document));
      }
      main.append(document.createElement("hr"));
      buildMetadata(main, document);
      return main;
    },
    generateDocumentPath: () => "/employees"
  };
  return __toCommonJS(import_employees_exports);
})();
