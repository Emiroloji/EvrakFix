/**
 * Performs a lightweight programmatic SPA transition using HTML5 History API
 * and dispatches a popstate event to trigger route updates.
 * 
 * @param path - The target clean URL path (e.g. '/pdf-merge')
 */
export function navigateTo(path: string) {
  window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
