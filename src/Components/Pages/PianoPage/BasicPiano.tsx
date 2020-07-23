import './styles.css'
import 'react-piano/dist/styles.css'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { FC, useEffect, useState } from 'react'
import useDimensions from 'react-cool-dimensions'
import { KeyboardShortcuts, MidiNumbers, Piano } from 'react-piano'

import { Melody } from '../../../@types/types'
import { SoundfontProvider } from '../../SoundfontProvider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { height: "100%" },
  })
)

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net"

const noteRange = {
  first: MidiNumbers.fromNote("c3"),
  last: MidiNumbers.fromNote("f4"),
}
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
})

export interface IPBasicPiano {
  melody?: Melody
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
}

export const BasicPiano: FC<IPBasicPiano> = (props) => {
  const { melody = [], isPlaying, setIsPlaying } = props
  const classes = useStyles()
  const [index, setIndex] = useState(0)

  const { ref, width } = useDimensions<HTMLDivElement>()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && index < melody.length - 1) {
      timer = setTimeout(() => {
        setIndex(index + 1)
      }, melody[index].duration)
    } else {
      setIndex(0)
      setIsPlaying(false)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isPlaying, index])

  return (
    <div ref={ref}>
      <SoundfontProvider
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        hostname={soundfontHostname}
        render={({ isLoading, playNote, stopNote }: any) => (
          <Piano
            noteRange={noteRange}
            width={width}
            playNote={playNote}
            stopNote={stopNote}
            disabled={isLoading}
            keyboardShortcuts={keyboardShortcuts}
            activeNotes={isPlaying ? melody[index].note : undefined}
          />
        )}
      />
    </div>
  )
}
