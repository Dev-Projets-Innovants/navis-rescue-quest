import { toast as sonnerToast } from 'sonner';

// Cache pour éviter les toasts dupliqués de Sonner
const sonnerCache = new Map<string, number>();
const CACHE_DURATION = 3000; // 3 secondes

/**
 * Wrapper autour de Sonner toast pour éviter les doublons
 */
export const toast = {
  success: (message: string) => {
    const cacheKey = `success-${message}`;
    const now = Date.now();
    const lastShown = sonnerCache.get(cacheKey);
    
    if (lastShown && now - lastShown < CACHE_DURATION) {
      return; // Toast déjà affiché récemment, on ignore
    }
    
    sonnerCache.set(cacheKey, now);
    setTimeout(() => sonnerCache.delete(cacheKey), CACHE_DURATION);
    
    return sonnerToast.success(message);
  },
  
  error: (message: string) => {
    const cacheKey = `error-${message}`;
    const now = Date.now();
    const lastShown = sonnerCache.get(cacheKey);
    
    if (lastShown && now - lastShown < CACHE_DURATION) {
      return; // Toast déjà affiché récemment, on ignore
    }
    
    sonnerCache.set(cacheKey, now);
    setTimeout(() => sonnerCache.delete(cacheKey), CACHE_DURATION);
    
    return sonnerToast.error(message);
  },
  
  info: (message: string) => {
    const cacheKey = `info-${message}`;
    const now = Date.now();
    const lastShown = sonnerCache.get(cacheKey);
    
    if (lastShown && now - lastShown < CACHE_DURATION) {
      return; // Toast déjà affiché récemment, on ignore
    }
    
    sonnerCache.set(cacheKey, now);
    setTimeout(() => sonnerCache.delete(cacheKey), CACHE_DURATION);
    
    return sonnerToast.info(message);
  }
};
