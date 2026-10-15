import { TradeOffer, ChatMessage } from '../types';

const STORAGE_PREFIX = 'vorteq_b2b_';
const LAST_SYNC_KEY = STORAGE_PREFIX + 'last_sync_timestamp';
const PENDING_MESSAGES_KEY = STORAGE_PREFIX + 'pending_offline_messages';
const SIMULATED_OFFLINE_KEY = STORAGE_PREFIX + 'simulated_offline';

export interface OfflineCacheStats {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  effectiveOffline: boolean;
  lastSyncTime: string;
  cachedOffersCount: number;
  cachedChatsCount: number;
  totalMessagesCount: number;
  pendingOfflineCount: number;
}

/**
 * Update the last synchronization timestamp
 */
export const updateLastSyncTimestamp = () => {
  try {
    const now = new Date().toISOString();
    localStorage.setItem(LAST_SYNC_KEY, now);
    return now;
  } catch {
    return new Date().toISOString();
  }
};

/**
 * Get formatted last sync time
 */
export const getLastSyncTimeFormatted = (): string => {
  try {
    const raw = localStorage.getItem(LAST_SYNC_KEY);
    if (!raw) return 'Sincronizado recientemente';
    const date = new Date(raw);
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    return `Hoy a las ${hours}:${mins}`;
  } catch {
    return 'Reciente';
  }
};

/**
 * Read whether simulated offline mode is active
 */
export const getSimulatedOfflineState = (): boolean => {
  try {
    return localStorage.getItem(SIMULATED_OFFLINE_KEY) === 'true';
  } catch {
    return false;
  }
};

/**
 * Toggle simulated offline mode
 */
export const setSimulatedOfflineState = (active: boolean) => {
  try {
    localStorage.setItem(SIMULATED_OFFLINE_KEY, active ? 'true' : 'false');
  } catch {}
};

/**
 * Retrieve comprehensive statistics about cached data for offline mode
 */
export const getOfflineCacheStats = (): OfflineCacheStats => {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const isSimulatedOffline = getSimulatedOfflineState();
  const effectiveOffline = !isOnline || isSimulatedOffline;

  let cachedOffersCount = 0;
  let cachedChatsCount = 0;
  let totalMessagesCount = 0;
  let pendingOfflineCount = 0;

  try {
    const offersRaw = localStorage.getItem(STORAGE_PREFIX + 'offers');
    if (offersRaw) {
      const parsed = JSON.parse(offersRaw);
      cachedOffersCount = Array.isArray(parsed) ? parsed.length : 0;
    }

    const chatsRaw = localStorage.getItem(STORAGE_PREFIX + 'chat_messages');
    if (chatsRaw) {
      const parsed: Record<string, ChatMessage[]> = JSON.parse(chatsRaw);
      cachedChatsCount = Object.keys(parsed).length;
      totalMessagesCount = Object.values(parsed).reduce((acc, msgs) => acc + (msgs?.length || 0), 0);
    }

    const pendingRaw = localStorage.getItem(PENDING_MESSAGES_KEY);
    if (pendingRaw) {
      const parsed = JSON.parse(pendingRaw);
      pendingOfflineCount = Array.isArray(parsed) ? parsed.length : 0;
    }
  } catch (e) {
    console.warn('Error reading offline cache stats:', e);
  }

  return {
    isOnline,
    isSimulatedOffline,
    effectiveOffline,
    lastSyncTime: getLastSyncTimeFormatted(),
    cachedOffersCount,
    cachedChatsCount,
    totalMessagesCount,
    pendingOfflineCount,
  };
};

/**
 * Queue an offline message created while without internet connection
 */
export const queueOfflineMessage = (targetUserId: string, message: ChatMessage) => {
  try {
    const pendingRaw = localStorage.getItem(PENDING_MESSAGES_KEY);
    const existing = pendingRaw ? JSON.parse(pendingRaw) : [];
    existing.push({
      targetUserId,
      message,
      queuedAt: new Date().toISOString(),
    });
    localStorage.setItem(PENDING_MESSAGES_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Error queuing offline message:', e);
  }
};

/**
 * Get all queued offline messages
 */
export const getQueuedOfflineMessages = (): Array<{ targetUserId: string; message: ChatMessage; queuedAt: string }> => {
  try {
    const pendingRaw = localStorage.getItem(PENDING_MESSAGES_KEY);
    return pendingRaw ? JSON.parse(pendingRaw) : [];
  } catch {
    return [];
  }
};

/**
 * Clear queued offline messages once synced
 */
export const clearQueuedOfflineMessages = () => {
  try {
    localStorage.removeItem(PENDING_MESSAGES_KEY);
  } catch {}
};
