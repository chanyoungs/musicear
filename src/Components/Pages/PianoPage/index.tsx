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
import CheckIcon from '@material-ui/icons/Check'
import HelpIcon from '@material-ui/icons/Help'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import RemoveIcon from '@material-ui/icons/Remove'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import StopIcon from '@material-ui/icons/Stop'
import React, { FC, Fragment, useState } from 'react'

import { Melody, Note, Play } from '../../../@types/types'
import { CustomBottomNavigation } from '../../Presentational/CustomBottomNavigation'
import { PianoContainer } from './PianoContainer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // color: theme.palette.common.white,
    },
    gridContainer: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  })
)

const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

const rootNote = 48

const scaleIntervals = [0, 2, 4, 5, 7, 9, 11]

const degreeToMidinumber = (scaleDegree: number) => {
  scaleDegree--
  return (
    rootNote +
    Math.floor(scaleDegree / 7) * 12 +
    scaleIntervals[scaleDegree % 7]
  )
}

const reference = [
  [degreeToMidinumber(3), degreeToMidinumber(5), degreeToMidinumber(8)],
  [degreeToMidinumber(4), degreeToMidinumber(6), degreeToMidinumber(8)],
  [degreeToMidinumber(5), degreeToMidinumber(7), degreeToMidinumber(9)],
  [degreeToMidinumber(3), degreeToMidinumber(5), degreeToMidinumber(8)],
  [degreeToMidinumber(1)],
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

  // Track notes played
  const [playedNotes, setPlayedNotes] = useState<number[]>([])
  const appendPlayedNote = (midiNumber: number) => {
    setPlayedNotes((playedNotes) => [...playedNotes, midiNumber])
  }

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
      notes.push([degreeToMidinumber(getRandomInt(0, 7))])
    }
    return makeMelody(notes)
  }
  const [melody, setMelody] = useState<Melody>(randomMelody())

  // Melody duration
  const updateMelodyDuration = (duration: number) => {
    melody.durations.forEach((duration, i) => {
      if (duration > 0) melody.durations[i] = duration
    })
  }

  const noteDurationInputError = () => {
    const n = Number.parseInt(noteDurationTemp)
    return isNaN(n) || n < 1
  }

  // Bottom Navigational onClick functions

  const playMelody = () => setPlay(play === "stop" ? "sound" : "stop")
  const nextMelody = () => {
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
  }

  const playReference = () => {
    setMelody((prevSong) =>
      makeMelody(reference, () => {
        setMelody(prevSong)
      })
    )
    setPlay("sound")
  }

  const playAnswer = () => setPlay("piano")

  // Key names, midinumbers, scale degrees

  const getKeyName = () => {
    const keyNames = ["C", "C#", "D", "D#", "E", "F", "G", "G#", "A", "A#", "B"]
    const keyName = keyNames[(rootNote + transpose - 4) % 11]
    const octave = Math.floor((rootNote + transpose - 4) / 11)
    return { keyName, octave }
  }

  const midinumberToDegree = (midiNumber: number) => {
    const relativeMidinumber = midiNumber - rootNote
    const interval = relativeMidinumber % 12
    const octave = Math.floor(relativeMidinumber / 12)
    const scaleDegrees: [number, string][] = [
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
    ]
    const scaleDegree = scaleDegrees[interval]
    return (scaleDegree[0] + octave * 7).toString() + scaleDegree[1]
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        justify="center"
        alignItems="center"
        spacing={2}
        className={classes.gridContainer}
      >
        <Grid item xs={12}>
          <PianoContainer
            melody={melody}
            play={play}
            setPlay={setPlay}
            transpose={transpose}
            degreeToMidinumber={degreeToMidinumber}
            appendPlayedNote={appendPlayedNote}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            {playedNotes &&
              playedNotes.map((note) => midinumberToDegree(note)).join(" ⮕ ")}
          </Typography>
        </Grid>

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
            helperText={
              noteDurationInputError() && "Must be a positive integer!"
            }
          />
        </Grid>
      </Grid>
      <CustomBottomNavigation
        bottomNavigationActions={[
          {
            label: "Reference",
            icon: <HelpIcon />,
            onClick: playReference,
          },
          {
            label: "Play",
            icon: play === "stop" ? <PlayArrowIcon /> : <StopIcon />,
            onClick: playMelody,
          },
          {
            label: "Next",
            icon: <SkipNextIcon />,
            onClick: nextMelody,
          },
          {
            label: "Answer",
            icon: <CheckIcon />,
            onClick: playAnswer,
          },
        ]}
      />
    </div>
  )
}
