// Accessibility utilities for MyPokeDex

/**
 * Announces content to screen readers
 * @param message - The message to announce
 * @param priority - The priority level ('polite' or 'assertive')
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.style.position = 'absolute'
  announcement.style.left = '-10000px'
  announcement.style.width = '1px'
  announcement.style.height = '1px'
  announcement.style.overflow = 'hidden'

  document.body.appendChild(announcement)
  announcement.textContent = message

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Manages focus for dynamic content
 * @param element - The element to focus
 */
export function manageFocus(element: HTMLElement): void {
  if (element && typeof element.focus === 'function') {
    element.focus()
  }
}

/**
 * Checks if the user is navigating with keyboard
 */
export function isKeyboardNavigation(): boolean {
  return document.activeElement !== document.body
}

/**
 * Traps focus within a container for modals/dialogs
 * @param container - The container element
 * @param event - The keyboard event
 */
export function trapFocus(container: HTMLElement, event: KeyboardEvent): void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus()
        event.preventDefault()
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus()
        event.preventDefault()
      }
    }
  }
}

/**
 * Generates accessible labels for Pokemon
 * @param pokemonName - The name of the Pokemon
 * @param additionalInfo - Additional context information
 */
export function generateAccessibleLabel(pokemonName: string, additionalInfo?: string): string {
  const baseLabel = `Pokemon: ${pokemonName}`
  return additionalInfo ? `${baseLabel}, ${additionalInfo}` : baseLabel
}

/**
 * Handles keyboard navigation for lists
 * @param event - The keyboard event
 * @param items - Array of items that can receive focus
 * @param currentIndex - Current focused item index
 * @param onSelect - Callback when an item is selected
 */
export function handleListKeyboardNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onSelect: (index: number) => void
): number {
  let newIndex = currentIndex

  switch (event.key) {
    case 'ArrowDown':
      newIndex = Math.min(currentIndex + 1, items.length - 1)
      event.preventDefault()
      break
    case 'ArrowUp':
      newIndex = Math.max(currentIndex - 1, 0)
      event.preventDefault()
      break
    case 'Enter':
    case ' ':
      onSelect(currentIndex)
      event.preventDefault()
      break
    case 'Home':
      newIndex = 0
      event.preventDefault()
      break
    case 'End':
      newIndex = items.length - 1
      event.preventDefault()
      break
  }

  if (newIndex !== currentIndex && items[newIndex]) {
    items[newIndex].focus()
  }

  return newIndex
}