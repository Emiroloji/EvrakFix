/**
 * Triggers the global custom event to open the "How are files secure?" explanation modal.
 */
export function openSecurityModal() {
  window.dispatchEvent(new CustomEvent('open-security-modal'));
}
