/*
 * Tabs Block
 * Adapted for this project from the Block Party "Tabs" entry
 * (https://github.com/niekraaijmakers/helix-demo/tree/main/blocks/tabs).
 * Reworked to follow project conventions: no lib-franklin dependency,
 * a simple one-row-per-tab content model, ARIA tab semantics, and
 * keyboard navigation. No fixed tab-count limit.
 *
 * Content model (each row = one tab):
 *   | Tabs            |                         |
 *   | Tab label 1     | Tab panel 1 content     |
 *   | Tab label 2     | Tab panel 2 content     |
 */

function selectTab(tablist, panels, index) {
  tablist.querySelectorAll('[role="tab"]').forEach((tab, i) => {
    const selected = i === index;
    tab.setAttribute('aria-selected', selected ? 'true' : 'false');
    tab.setAttribute('tabindex', selected ? '0' : '-1');
  });
  panels.forEach((panel, i) => {
    panel.hidden = i !== index;
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const panels = [];
  const tabs = [];

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const contentCell = cells[1] || document.createElement('div');

    const id = `tab-${index}`;
    const panelId = `tabpanel-${index}`;

    // Build the tab button from the label cell.
    const tab = document.createElement('button');
    tab.className = 'tabs-tab';
    tab.type = 'button';
    tab.id = id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panelId);
    tab.textContent = labelCell ? labelCell.textContent.trim() : `Tab ${index + 1}`;
    tabs.push(tab);
    tablist.append(tab);

    // Turn the content cell into a tab panel.
    const panel = contentCell;
    panel.className = 'tabs-panel';
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', id);
    panels.push(panel);
  });

  block.textContent = '';
  block.append(tablist, ...panels);

  // Interaction: click + keyboard (arrows, home, end).
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tablist, panels, index));
    tab.addEventListener('keydown', (e) => {
      let next;
      if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      else return;
      e.preventDefault();
      selectTab(tablist, panels, next);
      tabs[next].focus();
    });
  });

  selectTab(tablist, panels, 0);
}
