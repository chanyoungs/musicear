export type Note = number[]
export interface Melody {
  notes: Note[]
  durations: number[]
  callback?: () => void
}
export type Play = "piano" | "sound" | "stop"

export interface IFBError {
  code: string
  message: string
}

export interface IHistory {
  [key: number]: { [key: string]: [number, number] }
}

export interface ISettings {
  noteDisplayDegree: boolean
  noteDisplaySolfege: boolean
  melodyLength: number
  noteDuration: number
  breakDuration: number
  volume: number
  transpose: number
  keyFixed: boolean
  immediateFeedbackMode: boolean
  adversarialMode: boolean
}

export const defaultSettings: ISettings = {
  noteDisplayDegree: true,
  noteDisplaySolfege: false,
  melodyLength: 1,
  noteDuration: 1,
  breakDuration: 1,
  volume: 100,
  transpose: 0,
  keyFixed: true,
  immediateFeedbackMode: false,
  adversarialMode: false,
}
