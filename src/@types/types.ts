export type Note = number[]
export interface Melody {
  notes: Note[]
  durations: number[]
  callback?: () => void
}
export type Play = "piano" | "sound" | "stop"
