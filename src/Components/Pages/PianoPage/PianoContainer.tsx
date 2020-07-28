import '../../../react-piano/styles.css'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { FC, Fragment, useEffect, useState } from 'react'
import useDimensions from 'react-cool-dimensions'

import { Melody, Play } from '../../../@types/types'
import { KeyboardShortcuts, MidiNumbers, Piano } from '../../../react-piano'
import { LoadingBackdrop } from '../../Presentational/LoadingBackdrop'
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
  touchInput: boolean
  noteDuration: number
  volume: number
  melody: Melody
  play: Play
  setPlay: (play: Play) => void
  transpose: number
  degreeToMidinumber: (degree: number) => number
  midinumberToNoteName: (midinumber: number) => string
  appendPlayedNote: (midinumber: number) => void
}

export const PianoContainer: FC<IPPianoContainer> = ({
  touchInput,
  noteDuration,
  volume,
  melody,
  play,
  setPlay,
  transpose,
  degreeToMidinumber,
  midinumberToNoteName,
  appendPlayedNote,
}) => {
  const classes = useStyles()
  const { ref, width } = useDimensions<HTMLDivElement>()

  const [melodyIndex, setMelodyIndex] = useState(0)
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (play === "piano" && melodyIndex < melody.notes.length - 1) {
      timer = setTimeout(() => {
        setMelodyIndex(melodyIndex + 1)
      }, melody.durations[melodyIndex])
    } else if (play !== "sound") {
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

  const keyboardShortcuts: { key: string; midiNumber: number }[] = []
  for (let i = 1; i <= 8; i++) {
    keyboardShortcuts.push({
      key: midinumberToNoteName(degreeToMidinumber(i)),
      midiNumber: degreeToMidinumber(i),
    })
  }

  return (
    <div ref={ref}>
      <SoundfontProvider
        instrumentName="acoustic_grand_piano"
        audioContext={audioContext}
        hostname={soundfontHostname}
        transpose={transpose}
        noteDuration={noteDuration}
        volume={volume}
        render={({ isLoading, playNote, stopNote, stopAllNotes }) => (
          <Fragment>
            <LoadingBackdrop isLoading={isLoading} />
            <Piano
              useTouchEvents={touchInput}
              noteRange={noteRange}
              width={width}
              // keyWidthToHeight={1}
              playNote={playNote}
              // stopNote={stopNote}
              stopNote={() => {}}
              disabled={isLoading}
              keyboardShortcuts={keyboardShortcuts}
              activeNotes={
                play === "piano" ? melody.notes[melodyIndex] : undefined
              }
              onPlayNoteInput={(midiNumber: number) => {
                stopAllNotes()
                appendPlayedNote(midiNumber)
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
