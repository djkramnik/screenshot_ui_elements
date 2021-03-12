const scrollRecords: Record<string, number> = {}

export function getScrollRecord(key: string): number {
  return scrollRecords[key] ?? 0
}

export function incrementScrollRecord(key: string): number {
  scrollRecords[key] = (scrollRecords[key] ?? 0) + 1
  return scrollRecords[key]
}