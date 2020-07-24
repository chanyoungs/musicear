import './styles.css'
import 'react-piano/dist/styles.css'

import { Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import RemoveIcon from '@material-ui/icons/Remove'
import StopIcon from '@material-ui/icons/Stop'
import React, { FC, useState } from 'react'

import { Melody, Note, Play } from '../../../@types/types'
import { PianoContainer } from './PianoContainer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
  })
)

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const rootNote = 48

const scale = [
  rootNote,
  rootNote + 2,
  rootNote + 4,
  rootNote + 5,
  rootNote + 7,
  rootNote + 9,
  rootNote + 11,
  rootNote + 12,
]

const reference = [
  [scale[2] - 12, scale[4] - 12, scale[0]],
  [scale[5] - 12, scale[0], scale[3]],
  [scale[6] - 12, scale[1], scale[4]],
  [scale[2] - 12, scale[4] - 12, scale[0]],
  [scale[0]],
]

export const PianoPage: FC = () => {
  const classes = useStyles()
  const [play, setPlay] = useState<Play>("stop")
  const [melodyLength, setMelodyLength] = useState(1)
  const [noteDuration, setNoteDuration] = useState(1000)
  const [noteDurationTemp, setNoteDurationTemp] = useState(
    noteDuration.toString()
  )
  const [transpose, setTranspose] = useState(0)
  const [keyFixed, setKeyFixed] = useState(true)

  // Melody
  const makeMelody = (notes: Note[], callback?: () => void) => {
    const melody: Melody = { notes: [], durations: [], callback }
    notes.forEach((note) => {
      melody.notes.push(note)
      melody.notes.push([])
      melody.durations.push(noteDuration)
      melody.durations.push(0)
    })
    return melody
  }

  const randomMelody = (mLength?: number) => {
    if (!mLength) mLength = melodyLength
    const notes: Note[] = []
    for (let i = 0; i < mLength; i++) {
      notes.push([scale[getRandomInt(0, scale.length - 1)]])
    }
    return makeMelody(notes)
  }
  const [melody, setMelody] = useState<Melody>(randomMelody())

  // Song duration
  const updateMelodyDuration = (duration: number) => {
    melody.durations.forEach((duration, i) => {
      if (duration > 0) melody.durations[i] = duration
    })
  }

  const noteDurationInputError = () => {
    const n = Number.parseInt(noteDurationTemp)
    return isNaN(n) || n < 1
  }

  const getKeyName = () => {
    const keyNames = ["C", "C#", "D", "D#", "E", "F", "G", "G#", "A", "A#", "B"]
    const keyName = keyNames[(rootNote + transpose - 4) % 11]
    const octave = Math.floor((rootNote + transpose - 4) / 11)
    return { keyName, octave }
  }

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      spacing={2}
      className={classes.root}
    >
      <Grid item xs={12}>
        <PianoContainer
          melody={melody}
          play={play}
          setPlay={setPlay}
          transpose={transpose}
          scale={scale}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPlay(play === "stop" ? "sound" : "stop")}
        >
          {play === "stop" ? <PlayArrowIcon /> : <StopIcon />}
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (!keyFixed) {
              setTranspose(getRandomInt(0, 11))
              const referenceMelody = makeMelody(reference)
              const newRandomMelody = randomMelody()
              const tempMelody: Melody = {
                notes: [...referenceMelody.notes, [], ...newRandomMelody.notes],
                durations: [
                  ...referenceMelody.durations,
                  noteDuration,
                  ...newRandomMelody.durations,
                ],
                callback: () => {
                  setMelody(newRandomMelody)
                },
              }
              setMelody(tempMelody)
              setPlay("sound")
            } else {
              setMelody(randomMelody())
              setPlay("sound")
            }
          }}
          disabled={play !== "stop"}
        >
          NEW MELODY
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setMelody((prevSong) =>
              makeMelody(reference, () => {
                setMelody(prevSong)
              })
            )
            setPlay("sound")
          }}
        >
          REFERENCE
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setPlay("piano")}
        >
          CHECK ANSWER
        </Button>
      </Grid>
      <Grid item xs={12} />
      <Grid item>
        <Typography align="center">{`Melody Length: ${melodyLength}`}</Typography>
      </Grid>
      <Grid item>
        <ButtonGroup variant="contained" color="primary">
          <Button
            onClick={() => {
              const mLength = melodyLength + 1
              setMelodyLength(mLength)
              setMelody(randomMelody(mLength))
            }}
          >
            <AddIcon />
          </Button>
          <Button
            disabled={melodyLength < 2}
            onClick={() => {
              if (melodyLength > 1) {
                const mLength = melodyLength - 1
                setMelodyLength(mLength)
                setMelody(randomMelody(mLength))
              }
            }}
          >
            <RemoveIcon />
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} />
      <Grid item>
        <FormControlLabel
          control={
            <Checkbox
              checked={keyFixed}
              onChange={(event) => {
                setKeyFixed(event.target.checked)
              }}
            />
          }
          label="Fix key"
        />
      </Grid>
      <Grid item>
        <Typography align="center">
          {`Key: ${getKeyName().keyName} Octave: ${getKeyName().octave}`}
        </Typography>
      </Grid>
      <Grid item>
        <ButtonGroup variant="contained" color="primary">
          <Button
            disabled={!keyFixed}
            onClick={() => {
              setTranspose(transpose + 1)
              setMelody(randomMelody())
            }}
          >
            <AddIcon />
          </Button>
          <Button
            disabled={!keyFixed}
            onClick={() => {
              setTranspose(transpose - 1)
              setMelody(randomMelody())
            }}
          >
            <RemoveIcon />
          </Button>
          <Button
            disabled={!keyFixed}
            onClick={() => {
              setTranspose(getRandomInt(0, 11))
            }}
          >
            RANDOM
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} />
      <Grid item>
        <Typography align="center">Note duration in milliseconds</Typography>
      </Grid>
      <Grid item>
        <TextField
          value={noteDurationTemp}
          onChange={(event) => {
            const s = event.target.value
            setNoteDurationTemp(s)
            const n = parseInt(s)
            if (!isNaN(n) && n > 0) {
              setNoteDuration(n)
              updateMelodyDuration(n)
            }
          }}
          error={noteDurationInputError()}
          helperText={noteDurationInputError() && "Must be a positive integer!"}
        />
      </Grid>
    </Grid>
  )
}
