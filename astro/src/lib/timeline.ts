// Timeline Data Types and Utilities
export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
  significance: 'critical' | 'important' | 'supporting' | 'contextual';
  status?: 'verified' | 'partially_verified' | 'unverified' | 'draft';
  event_type: 'meeting' | 'document' | 'communication' | 'decision' | 'evidence' | 'milestone';
  participants?: string[];
  location?: string;
  evidence_ids?: string[];
  // Virtualization specific fields
  timestamp: number;
  y: number; // Calculated Y position
  tier: 'core' | 'extended'; // Core events (99) vs Extended (234)
}

export interface VirtualScrollState {
  scrollTop: number;
  viewportHeight: number;
  itemHeight: number;
  buffer: number; // Number of items to render outside viewport
  startIndex: number;
  endIndex: number;
  totalHeight: number;
}

export interface TimelineConfig {
  itemHeight: number;
  buffer: number;
  chunkSize: number; // Events per chunk for loading
  animationFrame: boolean; // Use RAF throttling
}

export const DEFAULT_CONFIG: TimelineConfig = {
  itemHeight: 80, // Height per timeline event in pixels
  buffer: 5, // Render 5 events above/below viewport
  chunkSize: 25, // Load 25 events per chunk
  animationFrame: true // Enable RAF throttling
};

// Performance utilities
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTiming(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.addMetric(label, duration);
    };
  }

  addMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(value);

    // Keep only last 100 measurements
    const values = this.metrics.get(label)!;
    if (values.length > 100) {
      values.splice(0, values.length - 100);
    }
  }

  getStats(label: string): { avg: number; p95: number; p99: number; count: number } {
    const values = this.metrics.get(label) || [];
    if (values.length === 0) {
      return { avg: 0, p95: 0, p99: 0, count: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
    const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;

    return { avg, p95, p99, count: values.length };
  }

  getAllStats(): Record<string, ReturnType<PerformanceMonitor['getStats']>> {
    const result: Record<string, ReturnType<PerformanceMonitor['getStats']>> = {};
    for (const label of this.metrics.keys()) {
      result[label] = this.getStats(label);
    }
    return result;
  }
}

// Virtual scrolling calculations
export function calculateVirtualScroll(
  events: TimelineEvent[],
  scrollTop: number,
  viewportHeight: number,
  config: TimelineConfig
): VirtualScrollState {
  const { itemHeight, buffer } = config;
  const totalHeight = events.length * itemHeight;

  // Calculate visible range with buffer
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const visibleCount = Math.ceil(viewportHeight / itemHeight);
  const endIndex = Math.min(events.length - 1, startIndex + visibleCount + buffer * 2);

  return {
    scrollTop,
    viewportHeight,
    itemHeight,
    buffer,
    startIndex,
    endIndex,
    totalHeight
  };
}

// Event chunking for lazy loading
export function createEventChunks(events: TimelineEvent[], chunkSize: number): TimelineEvent[][] {
  const chunks: TimelineEvent[][] = [];
  for (let i = 0; i < events.length; i += chunkSize) {
    chunks.push(events.slice(i, i + chunkSize));
  }
  return chunks;
}

// SVG element pool for reuse
export class SVGElementPool {
  private pool: SVGElement[] = [];
  private activeElements = new Set<SVGElement>();

  acquire(): SVGElement {
    let element = this.pool.pop();
    if (!element) {
      element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      element.setAttribute('class', 'timeline-event');
    }
    this.activeElements.add(element);
    return element;
  }

  release(element: SVGElement): void {
    if (this.activeElements.has(element)) {
      this.activeElements.delete(element);
      // Reset element state
      element.innerHTML = '';
      element.removeAttribute('transform');
      this.pool.push(element);
    }
  }

  clear(): void {
    this.pool = [];
    this.activeElements.clear();
  }
}

// RAF-throttled interaction handler
export function createRAFThrottle<T extends (...args: any[]) => void>(fn: T): T {
  let rafId: number | null = null;

  return ((...args: Parameters<T>) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      rafId = null;
      fn(...args);
    });
  }) as T;
}