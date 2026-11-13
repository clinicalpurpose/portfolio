/**
 * Shared behaviour for the panels that reveal under "Info" and "Contact".
 *
 * Markup:   <div class="reveal-group">  <a|button class="…toggle">  <div class="reveal">…</div>  </div>
 * Styling:  see "REVEAL" in src/styles/global.css. A group is open while it is
 *           hovered (on devices with a mouse) or while it has `data-open`.
 */

/** Wrap every word in <span class="w"> so words can fade in one after another. */
export function splitWords(root: Element) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (node.textContent?.trim()) nodes.push(node);
  }
  let i = 0;
  for (const node of nodes) {
    const frag = document.createDocumentFragment();
    for (const part of (node.textContent ?? '').split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(part);
      } else {
        const span = document.createElement('span');
        span.className = 'w';
        span.style.setProperty('--i', String(i++));
        span.textContent = part;
        frag.append(span);
      }
    }
    node.replaceWith(frag);
  }
}

interface ToggleOptions {
  group: HTMLElement;
  toggle: HTMLElement;
  /** Elements that close the panel when clicked while it is open (e.g. the name) */
  closers?: (HTMLElement | null)[];
  /** Change the address bar while open, e.g. /info ↔ / */
  openPath?: string;
  closedPath?: string;
  onChange?: (open: boolean) => void;
}

const norm = (p: string) => p.replace(/\/$/, '') || '/';

/** Click / Enter keeps the panel open; click outside, Escape or Back closes it. */
export function setupToggle({ group, toggle, closers = [], openPath, closedPath, onChange }: ToggleOptions) {
  const panel = group.querySelector<HTMLElement>('.reveal');
  if (panel) splitWords(panel);

  const isOpen = () => group.hasAttribute('data-open');
  const set = (open: boolean, updateUrl = true) => {
    group.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (updateUrl && openPath && closedPath) {
      const path = open ? openPath : closedPath;
      if (norm(location.pathname) !== norm(path)) history.pushState({}, '', path);
    }
    onChange?.(open);
  };

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    set(!isOpen());
  });

  for (const el of closers) {
    el?.addEventListener('click', (e) => {
      if (!isOpen()) return;
      e.preventDefault();
      set(false);
      el.blur();
    });
  }

  document.addEventListener('click', (e) => {
    const t = e.target as Node;
    if (isOpen() && !group.contains(t) && !closers.some((c) => c?.contains(t))) set(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      set(false);
      toggle.focus();
    }
  });

  if (openPath) {
    window.addEventListener('popstate', () => set(norm(location.pathname) === norm(openPath), false));
  }

  return { set, isOpen };
}
