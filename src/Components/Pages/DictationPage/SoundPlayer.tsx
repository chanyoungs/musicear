import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FC, useEffect, useState } from 'react'

import { IPRender } from '../../SoundfontProvider'
import { Melody, Play } from './types'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

export type IPSoundPlayer = IPRender & {
  melody: Melody
  play: Play
  setPlay: (play: Play) => void
}

export const SoundPlayer: FC<IPSoundPlayer> = ({
  isLoading,
  playNote,
  stopNote,
  stopAllNotes,
  melody,
  play,
  setPlay,
}) => {
  const classes = useStyles()
  const [melodyIndex, setMelodyIndex] = useState(0)
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (play === "sound") {
      melody.notes[melodyIndex].forEach((note) => {
        playNote(note)
      })
    }
    if (play === "sound" && melodyIndex < melody.notes.length - 1) {
      timer = setTimeout(() => {
        setMelodyIndex(melodyIndex + 1)
      }, melody.durations[melodyIndex])
    } else if (play !== "piano") {
      setMelodyIndex(0)
      setPlay("stop")
      if (melody.callback) {
        melody.callback()
      }
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [play, melodyIndex])

  return null
}
