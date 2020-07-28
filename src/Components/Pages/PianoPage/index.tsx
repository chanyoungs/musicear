import { Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Slider from '@material-ui/core/Slider'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import BackspaceIcon from '@material-ui/icons/Backspace'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import HelpIcon from '@material-ui/icons/Help'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import RemoveIcon from '@material-ui/icons/Remove'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import StopIcon from '@material-ui/icons/Stop'
import React, { FC, Fragment, useCallback, useEffect, useState } from 'react'

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
    displayPaperContainer: {
      padding: theme.spacing(2),
      width: "100%",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    displayResult: {
      color: theme.palette.common.white,
    },
    pianoContainer: {
      margin: theme.spacing(2),
    },
    settingsItems: {
      overflow: "auto",
      maxHeight: "50vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    displayPaper: {
      width: "100%",
      minHeight: theme.spacing(10),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
)

type History = { [key: number]: { [key: string]: [number, number] } }

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

const referenceDuration = 0.5

export const PianoPage: FC = () => {
  const classes = useStyles()
  const [openSettings, setOpenSettings] = useState(true)
  const [touchInput, setTouchInput] = useState(false)
  const [noteDisplayDegree, setNoteDisplayDegree] = useState(true)
  const [noteDisplaySolfege, setNoteDisplaySolfege] = useState(false)
  const [play, setPlay] = useState<Play>("stop")
  const [melodyLength, setMelodyLength] = useState(1)

  const [noteDuration, setNoteDuration] = useState(1)
  const [breakDuration, setBreakDuration] = useState(2)
  const [volume, setVolume] = useState(10)
  const [tempVolume, setTempVolume] = useState(volume * 10)

  const [transpose, setTranspose] = useState(0)
  const [keyFixed, setKeyFixed] = useState(true)

  const [immediateFeedbackMode, setImmediateFeedbackMode] = useState(false)
  const [adversarialMode, setAdversarialMode] = useState(false)
  const getAdversarialWeight = (results: [number, number]) =>
    results[0] - results[1]

  const [history, setHistory] = useState<History>({})
  const [melodyNotes, setMelodyNotes] = useState<Note[]>([])

  // Track notes played
  const [playedNotes, setPlayedNotes] = useState<number[]>([])
  const appendPlayedNote = (midiNumber: number) => {
    setPlayedNotes((playedNotes) => [...playedNotes, midiNumber])
  }

  useEffect(() => {
    if (
      immediateFeedbackMode &&
      playedNotes.length > 0 &&
      playedNotes.length * 2 <= melody.notes.length
    ) {
      if (
        playedNotes[playedNotes.length - 1] !==
        melody.notes[(playedNotes.length - 1) * 2][0]
      ) {
        setSnackbar({
          open: true,
          severity: "error",
          message: "Wrong note!",
          callback: adversarialMode ? playNextMelody : undefined,
        })
      } else {
        if (playedNotes.length * 2 === melody.notes.length) {
          setPlay("stop")
          setSnackbar({
            open: true,
            severity: "success",
            message: "Correct!",
            callback: playNextMelody,
          })
        }
      }
    }
  }, [playedNotes])

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
      melody.durations.push(duration * 1000)
      melody.durations.push(0)
    })
    return melody
  }

  const randomMelody = (mLength?: number) => {
    let notes: Note[]
    if (adversarialMode && melodyLength in history && Math.random() < 0.2) {
      const melodyLengthObj = history[melodyLength]

      const sortedKeys = Object.keys(melodyLengthObj).sort(
        (key1, key2) =>
          getAdversarialWeight(melodyLengthObj[key1]) -
          getAdversarialWeight(melodyLengthObj[key2])
      )
      const chosenKey = sortedKeys[0]
      notes = chosenKey.split(",").map((keyString) => [parseInt(keyString)])
    } else {
      notes = []
      if (!mLength) mLength = melodyLength
      for (let i = 0; i < mLength; i++) {
        notes.push([degreeToMidinumber(getRandomInt(1, 8))])
      }
    }
    setMelodyNotes(notes)
    return makeMelody({ notes })
  }

  const [melody, setMelody] = useState<Melody>(() => randomMelody())

  // Melody duration
  const updateMelodyDuration = (duration: number) => {
    melody.durations.forEach((duration, i) => {
      if (duration > 0) melody.durations[i] = duration
    })
  }

  // Bottom Navigational onClick functions
  const playMelody = () => setPlay("sound")
  const stopMelody = () => setPlay("stop")
  const playNextMelody = () => {
    setPlayedNotes([])
    let nextMelody: Melody
    if (!keyFixed) {
      setTranspose(getRandomInt(0, 11))
      const referenceMelody = makeMelody({
        notes: reference,
        duration: referenceDuration,
      })
      const newRandomMelody = randomMelody()
      nextMelody = {
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
    } else {
      nextMelody = randomMelody()
    }
    setMelody(nextMelody)
    setPlay("sound")
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
    callback?: () => void
  }
  const defaultSnackbar: Snackbar = {
    open: false,
    severity: "error",
    message: "",
  }
  const [snackbar, setSnackbar] = useState<Snackbar>(defaultSnackbar)

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
          setSnackbar({
            open: true,
            severity: "error",
            message: "Incorrect!",
          })
          return
        }
      }
      setSnackbar({ open: true, severity: "success", message: "Correct!" })
    }
  }

  // History
  const getHistoryKey = () => melodyNotes.join(",")

  useEffect(() => {
    if (snackbar.open) {
      setHistory((prevHistory) => {
        const historyKey = getHistoryKey()
        const newHistory = { ...prevHistory }
        if (!(melodyLength in newHistory)) {
          newHistory[melodyLength] = {}
        }
        const melodyLengthObject = newHistory[melodyLength]
        if (!(historyKey in melodyLengthObject)) {
          melodyLengthObject[historyKey] = [0, 0] // [Corrects, Wrongs]
        }
        melodyLengthObject[historyKey][
          snackbar.severity === "error" ? 1 : 0
        ] += 1
        return newHistory
      })
    }
  }, [snackbar])

  const displayResult = () => {
    let resultText = "First attempt"
    if (melodyLength in history) {
      const melodyNumberObj = history[melodyLength]
      const melodyKey = getHistoryKey()
      if (melodyKey in melodyNumberObj) {
        const result = melodyNumberObj[melodyKey]
        resultText = `Correct: ${result[0]} Wrong: ${result[1]} Total: ${
          result[0] + result[1]
        }`
      }
    }
    return resultText
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
        autoHideDuration={breakDuration * 1000}
        severity={snackbar.severity}
        message={snackbar.message}
        onCloseSnackbar={(event, reason) => {
          if (reason === "timeout") {
            if (snackbar.callback) snackbar.callback()
            setSnackbar((prevSnackbar) => ({ ...prevSnackbar, open: false }))
          }
        }}
        onCloseAlert={(event) => {
          if (snackbar.callback) snackbar.callback()
          setSnackbar((prevSnackbar) => ({ ...prevSnackbar, open: false }))
        }}
      />
      <SettingsDialog
        open={openSettings}
        setOpen={setOpenSettings}
        setTouchInput={setTouchInput}
      >
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
            title={`Melody length: ${melodyLength}`}
            content={
              <ButtonGroup variant="contained" color="primary">
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
                <Button
                  onClick={() => {
                    const mLength = melodyLength + 1
                    setMelodyLength(mLength)
                    setMelody(randomMelody(mLength))
                  }}
                >
                  <AddIcon />
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
                      setTranspose(transpose - 1)
                      setMelody(randomMelody())
                    }}
                  >
                    <RemoveIcon />
                  </Button>
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
            title="Values"
            content={
              <Fragment>
                <Typography gutterBottom>{`Volume: ${tempVolume}%`}</Typography>
                <Slider
                  value={tempVolume}
                  valueLabelDisplay="auto"
                  step={1}
                  min={0}
                  max={200}
                  marks={[
                    { value: 0, label: "0" },
                    { value: 200, label: "200" },
                  ]}
                  onChange={(event, value) => {
                    setTempVolume(value as number)
                  }}
                  onChangeCommitted={(event, value) => {
                    setVolume((value as number) / 10)
                  }}
                />
                <Typography
                  gutterBottom
                >{`Note duration: ${noteDuration}s`}</Typography>
                <Slider
                  value={noteDuration}
                  valueLabelDisplay="auto"
                  step={0.1}
                  min={0.1}
                  max={4}
                  marks={[
                    { value: 0.1, label: "0.1s" },
                    { value: 4, label: "4s" },
                  ]}
                  onChange={(event, value) => {
                    setNoteDuration(value as number)
                  }}
                />
                <Typography
                  gutterBottom
                >{`Break duration: ${breakDuration}s`}</Typography>
                <Slider
                  value={breakDuration}
                  valueLabelDisplay="auto"
                  step={0.1}
                  min={0.1}
                  max={4}
                  marks={[
                    { value: 0.1, label: "0.1s" },
                    { value: 4, label: "4s" },
                  ]}
                  onChange={(event, value) => {
                    setBreakDuration(value as number)
                  }}
                />
              </Fragment>
            }
          />
          <SettingItemPaper
            title="Play mode"
            content={
              <Fragment>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={immediateFeedbackMode}
                      onChange={(event) => {
                        setImmediateFeedbackMode(event.target.checked)
                      }}
                    />
                  }
                  label="Immediate feedback"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={adversarialMode}
                      onChange={(event) => {
                        setAdversarialMode(event.target.checked)
                      }}
                    />
                  }
                  label="Adversarial"
                />
              </Fragment>
            }
          />
        </div>
      </SettingsDialog>
      <CustomAppBar
        onClickSettings={() => {
          setOpenSettings(true)
        }}
      />
      <div className={classes.displayPaperContainer}>
        <Typography
          className={classes.displayResult}
          align="center"
          variant="h6"
        >
          {displayResult()}
        </Typography>
        <Paper className={classes.displayPaper}>
          <Typography variant="h6" align="center" display="inline">
            {playedNotes.length > 0 && (noteDisplayDegree || noteDisplaySolfege)
              ? playedNotes.map((note) => midinumberToNoteName(note)).join(", ")
              : "..."}
          </Typography>
          <div>
            <IconButton
              disabled={playedNotes.length === 0}
              onClick={() => {
                setPlayedNotes(playedNotes.slice(0, -1))
              }}
            >
              <BackspaceIcon />
            </IconButton>
            <IconButton
              disabled={playedNotes.length === 0}
              onClick={() => {
                setPlayedNotes([])
              }}
            >
              <ClearIcon />
            </IconButton>
          </div>
        </Paper>
      </div>
      <div className={classes.pianoContainer}>
        <PianoContainer
          touchInput={touchInput}
          noteDuration={noteDuration}
          volume={volume}
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
        bottomNavigationActions={
          play === "stop"
            ? [
                {
                  label: "Reference",
                  icon: <HelpIcon />,
                  onClick: playReference,
                },
                {
                  label: "Play",
                  icon: <PlayArrowIcon />,
                  onClick: playMelody,
                },
                {
                  label: "Next",
                  icon: <SkipNextIcon />,
                  onClick: playNextMelody,
                },
                {
                  label: "Answer",
                  icon: <CheckIcon />,
                  onClick: checkAndPlayAnswer,
                },
              ]
            : [
                {
                  label: "Stop",
                  icon: <StopIcon />,
                  onClick: stopMelody,
                },
              ]
        }
      />
    </div>
  )
}
