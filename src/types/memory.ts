/** Historical screenshot entry — only `image` is required. */
export interface MemoryEntry {
  image: string;
  title?: string;
  description?: string;
  year?: string;
  map?: string;
  server?: string;
  date?: string;
}
