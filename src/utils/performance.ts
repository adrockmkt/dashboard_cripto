/**
 * Utilitários de performance e otimização
 */

/**
 * Throttle - Limita execução de função a uma vez por intervalo
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Debounce - Aguarda delay após última chamada antes de executar
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Memoização simples para funções puras
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Lazy loading de imagens
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  placeholder?: string
): void {
  if (placeholder) {
    img.src = placeholder;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        observer.unobserve(img);
      }
    });
  });
  
  observer.observe(img);
}

/**
 * Verificar se está em viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Performance mark para medir tempo de execução
 */
export function measurePerformance(name: string, fn: () => void): void {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  
  performance.mark(startMark);
  fn();
  performance.mark(endMark);
  
  performance.measure(name, startMark, endMark);
  const measure = performance.getEntriesByName(name)[0];
  
  console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
  
  performance.clearMarks(startMark);
  performance.clearMarks(endMark);
  performance.clearMeasures(name);
}
