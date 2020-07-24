import './styles.css'
import 'react-piano/dist/styles.css'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { FC, Fragment, useEffect, useState } from 'react'
import useDimensions from 'react-cool-dimensions'
import { KeyboardShortcuts, MidiNumbers, Piano } from 'react-piano'

import { Melody, Play } from '../../../@types/types'
import { SoundfontProvider } from '../../SoundfontProvider'
import { SoundPlayer } from './SoundPlayer'

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
  last: MidiNumbers.fromNote("c4"),
}

export interface IPPianoContainer {
  melody: Melody
  play: Play
  setPlay: (play: Play) => void
  transpose: number
  scale: number[]
}

export const PianoContainer: FC<IPPianoContainer> = ({
  melody,
  play,
  setPlay,
  transpose,
  scale,
}) => {
  const classes = useStyles()
  const { ref, width } = useDimensions<HTMLDivElement>()

  const [melodyIndex, setMelodyIndex] = useState(0)
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (play === "piano") {
      if (melodyIndex < melody.notes.length - 1) {
        timer = setTimeout(() => {
          setMelodyIndex(melodyIndex + 1)
        }, melody.durations[melodyIndex])
      } else {
        setMelodyIndex(0)
        setPlay("stop")
        if (melody.callback) {
          melody.callback()
        }
      }
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [play, melodyIndex])

  const keyboardShortcuts = scale.map((midiNumber, i) => ({
    key: (i + 1).toString(),
    midiNumber,
  }))

  return (
    <div ref={ref}>
      <SoundfontProvider
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        hostname={soundfontHostname}
        transpose={transpose}
        render={({ isLoading, playNote, stopNote, stopAllNotes }) => (
          <Fragment>
            <Piano
              noteRange={noteRange}
              width={width}
              playNote={playNote}
              stopNote={stopNote}
              disabled={isLoading}
              keyboardShortcuts={keyboardShortcuts}
              activeNotes={
                play === "piano" ? melody.notes[melodyIndex] : undefined
              }
              onPlayNoteInput={(midiNumber: number) => {
                console.log(midiNumber, "play")
              }}
              onStopNoteInput={(
                midiNumber: number,
                { prevActiveNotes }: any
              ) => {
                console.log(midiNumber, "stop")
              }}
            />
            <SoundPlayer
              playNote={playNote}
              stopNote={stopNote}
              isLoading={isLoading}
              stopAllNotes={stopAllNotes}
              melody={melody}
              play={play}
              setPlay={setPlay}
            />
          </Fragment>
        )}
      />
    </div>
  )
}
