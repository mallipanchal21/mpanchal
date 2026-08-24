/*
 * Employee List Block
 *
 * Content model: a single cell containing a link to the published employees
 * spreadsheet JSON (e.g. /employees.json). Falls back to /employees.json.
 *
 * Renders employees PAGE_SIZE (10) rows at a time. A "Load more" button
 * appends the next page. The button label is sourced from the placeholders
 * sheet (key: loadMore), falling back to "Load more".
 */

const PAGE_SIZE = 10;
const COLUMNS = ['Name', 'Department', 'Experience', 'City'];

/**
 * Fetches and caches the placeholders sheet, returning a key/value map.
 * The project's aem.js does not ship fetchPlaceholders, so implement it here.
 * @returns {Promise<Object>} map of placeholder key -> value
 */
async function fetchPlaceholders() {
  if (!window.placeholders) {
    window.placeholders = (async () => {
      try {
        const resp = await fetch(`${window.hlx?.codeBasePath || ''}/placeholders.json`);
        if (!resp.ok) return {};
        const json = await resp.json();
        const rows = json.data || [];
        return rows.reduce((acc, row) => {
          if (row.Key) acc[row.Key] = row.Value;
          return acc;
        }, {});
      } catch {
        return {};
      }
    })();
  }
  return window.placeholders;
}

/**
 * Resolves the employees JSON source from the block content.
 * @param {Element} block the block element
 * @returns {string} the JSON source path/URL
 */
function resolveSource(block) {
  const link = block.querySelector('a[href]');
  if (link) return link.getAttribute('href');
  const text = block.textContent.trim();
  if (text) return text;
  return '/employees.json';
}

/**
 * Builds a single employee row element.
 * @param {Object} employee an employee record
 * @returns {HTMLElement} the row element
 */
function buildRow(employee) {
  const row = document.createElement('div');
  row.className = 'employee-list-row';
  COLUMNS.forEach((col) => {
    const cell = document.createElement('div');
    cell.className = `employee-list-cell employee-list-cell-${col.toLowerCase()}`;
    cell.dataset.label = col;
    cell.textContent = employee[col] ?? '';
    row.append(cell);
  });
  return row;
}

/**
 * Builds the header row.
 * @returns {HTMLElement} the header row element
 */
function buildHeader() {
  const header = document.createElement('div');
  header.className = 'employee-list-row employee-list-header';
  COLUMNS.forEach((col) => {
    const cell = document.createElement('div');
    cell.className = `employee-list-cell employee-list-cell-${col.toLowerCase()}`;
    cell.textContent = col;
    header.append(cell);
  });
  return header;
}

export default async function decorate(block) {
  const source = resolveSource(block);
  const [placeholders, employees] = await Promise.all([
    fetchPlaceholders(),
    (async () => {
      const resp = await fetch(source);
      if (!resp.ok) throw new Error(`Failed to load employees: ${resp.status}`);
      const json = await resp.json();
      return json.data || [];
    })().catch(() => []),
  ]);

  block.textContent = '';

  const table = document.createElement('div');
  table.className = 'employee-list-table';
  table.setAttribute('role', 'table');
  table.append(buildHeader());

  const body = document.createElement('div');
  body.className = 'employee-list-body';
  table.append(body);
  block.append(table);

  let rendered = 0;
  const renderNext = () => {
    const next = employees.slice(rendered, rendered + PAGE_SIZE);
    next.forEach((employee) => body.append(buildRow(employee)));
    rendered += next.length;
  };

  // initial page
  renderNext();

  if (employees.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'employee-list-empty';
    empty.textContent = 'No employees found.';
    block.append(empty);
    return;
  }

  // "Load more" — label sourced from placeholders sheet
  if (employees.length > PAGE_SIZE) {
    const label = placeholders.loadMore || 'Load more';
    const actions = document.createElement('div');
    actions.className = 'employee-list-actions';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'employee-list-load-more button';
    button.textContent = label;
    actions.append(button);
    block.append(actions);

    button.addEventListener('click', () => {
      renderNext();
      if (rendered >= employees.length) {
        actions.remove();
      }
    });
  }
}
