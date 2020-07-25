import './styles.css'
import 'react-piano/dist/styles.css'

import { Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import AddIcon from '@material-ui/icons/Add'
import CheckIcon from '@material-ui/icons/Check'
import HelpIcon from '@material-ui/icons/Help'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import RefreshIcon from '@material-ui/icons/Refresh'
import RemoveIcon from '@material-ui/icons/Remove'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import StopIcon from '@material-ui/icons/Stop'
import React, { FC, Fragment, useState } from 'react'

import { Melody, Note, Play } from '../../../@types/types'
import { getRandomInt, noteNames, scaleIntervals } from '../../../utils'
import { CustomAppBar } from '../../Presentational/CustomAppBar'
import { CustomBottomNavigation } from '../../Presentational/CustomBottomNavigation'
import { CustomSnackbar } from '../../Presentational/CustomSnackbar'
import { SettingItemPaper } from '../../Presentational/SettingItemPaper'
import { SettingsDialog } from '../../Presentational/SettingsDialog'
import { PianoContainer } from './PianoContainer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "spaceBetween",
      width: "100%",
    },
    container: {
      padding: theme.spacing(2),
      width: "100%",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    filler: {
      padding: 0,
      flex: 1,
    },
    settingsItems: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    displayNotes: {
      width: "100%",
      minHeight: theme.spacing(6),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
)

const rootNote = 48

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

const referenceDuration = 500

export const PianoPage: FC = () => {
  const classes = useStyles()
  const [openSettings, setOpenSettings] = useState(false)
  const [noteDisplayDegree, setNoteDisplayDegree] = useState(true)
  const [noteDisplaySolfege, setNoteDisplaySolfege] = useState(false)
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
  const makeMelody = (props: {
    notes: Note[]
    callback?: () => void
    duration?: number
  }) => {
    const { notes, callback, duration = noteDuration } = props
    const melody: Melody = { notes: [], durations: [], callback }
    notes.forEach((note) => {
      melody.notes.push(note)
      melody.notes.push([])
      melody.durations.push(duration)
      melody.durations.push(0)
    })
    return melody
  }

  const randomMelody = (mLength?: number) => {
    if (!mLength) mLength = melodyLength
    const notes: Note[] = []
    for (let i = 0; i < mLength; i++) {
      notes.push([degreeToMidinumber(getRandomInt(1, 8))])
    }
    return makeMelody({ notes })
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
    setPlayedNotes([])
    if (!keyFixed) {
      setTranspose(getRandomInt(0, 11))
      const referenceMelody = makeMelody({
        notes: reference,
        duration: referenceDuration,
      })
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
      makeMelody({
        notes: reference,
        callback: () => {
          setMelody(prevSong)
        },
        duration: referenceDuration,
      })
    )
    setPlay("sound")
  }

  // Check Answer
  type Snackbar = {
    open: boolean
    severity: "error" | "success"
    message: string
  }
  const defaultSnackbar: Snackbar = {
    open: false,
    severity: "error",
    message: "",
  }
  const [snackbar, setSnackbar] = useState<Snackbar>(defaultSnackbar)
  const handleCloseSnackbar = () => {
    setSnackbar((prevSnackbar) => ({ ...prevSnackbar, open: false }))
  }

  const checkAndPlayAnswer = () => {
    setPlay("piano")
    if (playedNotes.length * 2 < melody.notes.length) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Not enough notes played!",
      })
    } else if (playedNotes.length * 2 > melody.notes.length) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Too many notes played!",
      })
    } else {
      for (let i = 0; i < playedNotes.length; i++) {
        if (playedNotes[i] !== melody.notes[i * 2][0]) {
          setSnackbar({ open: true, severity: "error", message: "Incorrect!" })
          return
        }
      }
      setSnackbar({ open: true, severity: "success", message: "Correct!" })
    }
  }

  // Key names
  const getKeyName = () => {
    const keyName = noteNames.letter[(rootNote + transpose - 4) % 11]
    const octave = Math.floor((rootNote + transpose - 4) / 11)
    return { keyName, octave }
  }

  const midinumberToNoteName = (midiNumber: number) => {
    if (!noteDisplayDegree && !noteDisplaySolfege) return ""

    const relativeMidinumber = midiNumber - rootNote
    const interval = relativeMidinumber % 12
    const octave = Math.floor(relativeMidinumber / 12)
    const scaleDegree = noteNames.degree[interval]
    const nameDegree = (scaleDegree[0] + octave * 7).toString() + scaleDegree[1]
    if (noteDisplayDegree && !noteDisplaySolfege) return nameDegree

    const nameSolfege = noteNames.solfege[interval]
    if (!noteDisplayDegree && noteDisplaySolfege) return nameSolfege

    return nameDegree + " " + nameSolfege
  }

  return (
    <div className={classes.root}>
      <CustomSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={handleCloseSnackbar}
      />
      <SettingsDialog open={openSettings} setOpen={setOpenSettings}>
        <div className={classes.settingsItems}>
          <SettingItemPaper
            title="Note display mode"
            content={
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={noteDisplayDegree}
                      onChange={(event) => {
                        setNoteDisplayDegree(event.target.checked)
                      }}
                      name="checkedA"
                    />
                  }
                  label="Degree"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={noteDisplaySolfege}
                      onChange={(event) => {
                        setNoteDisplaySolfege(event.target.checked)
                      }}
                      name="checkedA"
                    />
                  }
                  label="Solfege"
                />
              </FormGroup>
            }
          />
          <SettingItemPaper
            title={`Melody Length: ${melodyLength}`}
            content={
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
            }
          />
          <SettingItemPaper
            title={`Key: ${getKeyName().keyName} Octave: ${
              getKeyName().octave
            }`}
            content={
              <Fragment>
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
                    ?
                  </Button>
                </ButtonGroup>
              </Fragment>
            }
          />
          <SettingItemPaper
            title="Note duration(ms)"
            content={
              <TextField
                size="small"
                variant="outlined"
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
            }
          />
        </div>
      </SettingsDialog>
      <CustomAppBar
        onClickSettings={() => {
          setOpenSettings(true)
        }}
      />
      <div className={classes.container}>
        <Paper className={classes.displayNotes}>
          <Typography variant="h6" align="center">
            {playedNotes &&
              (noteDisplayDegree || noteDisplaySolfege) &&
              playedNotes.map((note) => midinumberToNoteName(note)).join(" ⮕ ")}
          </Typography>
          <IconButton
            disabled={playedNotes.length === 0}
            onClick={() => {
              setPlayedNotes([])
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Paper>
      </div>
      <div className={classes.container}>
        <PianoContainer
          noteDuration={noteDuration}
          melody={melody}
          play={play}
          setPlay={setPlay}
          transpose={transpose}
          degreeToMidinumber={degreeToMidinumber}
          midinumberToNoteName={midinumberToNoteName}
          appendPlayedNote={appendPlayedNote}
        />
      </div>
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
            onClick: checkAndPlayAnswer,
          },
        ]}
      />
    </div>
  )
}
