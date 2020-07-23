import './styles.css'
import 'react-piano/dist/styles.css'

import Button from '@material-ui/core/Button'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { FC, Fragment, useState } from 'react'

import { Melody } from '../../../@types/types'
import { BasicPiano } from './BasicPiano'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const getScale = (rootNote: number) => [
  rootNote,
  rootNote + 2,
  rootNote + 4,
  rootNote + 5,
  rootNote + 7,
  rootNote + 9,
  rootNote + 11,
  rootNote + 12,
]

export const PianoPage: FC = () => {
  const classes = useStyles()
  const [isPlaying, setIsPlaying] = useState(false)
  const [melodyLength, setMelodyLength] = useState(5)
  const [rootNote, setRootNote] = useState(48)
  const [noteDuration, setNoteDuration] = useState(1000)
  const [breakDuration, setBreakDuration] = useState(0)

  const randomMelody = () => {
    const melody: Melody = []
    const scale = getScale(rootNote)
    for (let i = 0; i < melodyLength; i++) {
      melody.push({
        note: [scale[getRandomInt(0, scale.length - 1)]],
        duration: noteDuration,
      })
      melody.push({ note: [], duration: breakDuration })
    }
    return melody
  }
  const [melody, setMelody] = useState<Melody>(randomMelody())

  return (
    <Fragment>
      <BasicPiano
        melody={melody}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
      <Button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "STOP" : "PLAY"}
      </Button>
      <Button
        onClick={() => {
          setMelody(randomMelody())
          setIsPlaying(true)
        }}
        disabled={isPlaying}
      >
        NEW MELODY
      </Button>
      <Button
        onClick={() => {
          setRootNote(getRandomInt(48, 59))
          setIsPlaying(true)
        }}
        disabled={isPlaying}
      >
        CHANGE KEY
      </Button>
    </Fragment>
  )
}
