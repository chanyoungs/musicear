export const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const scaleIntervals = [0, 2, 4, 5, 7, 9, 11]

export type NoteNames = {
  degree: [number, string][]
  letter: string[]
  solfege: string[]
}

export const noteNames: NoteNames = {
  degree: [
    [1, ""],
    [1, "#"],
    [2, ""],
    [2, "#"],
    [3, ""],
    [4, ""],
    [4, "#"],
    [5, ""],
    [5, "#"],
    [6, ""],
    [6, "#"],
    [7, ""],
    [7, ""],
  ],
  letter: ["C", "C#", "D", "D#", "E", "F", "G", "G#", "A", "A#", "B"],
  solfege: [
    "Do",
    "Do#",
    "Re",
    "Re#",
    "Mi",
    "Fa",
    "Fa#",
    "Sol",
    "Sol#",
    "La",
    "La#",
    "Ti",
  ],
}
