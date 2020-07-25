import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FC, ReactElement, useEffect, useState } from 'react'
import Soundfont from 'soundfont-player'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

export interface IPRender {
  isLoading: boolean
  playNote: (midinumber: number) => void
  stopNote: (midinumber: number) => void
  stopAllNotes: () => void
}

export interface IPSoundfontProvider {
  instrumentName?: Soundfont.InstrumentName
  hostname: string
  format?: "mp3" | "ogg"
  soundfont?: "MusyngKite" | "FluidR3_GM"
  transpose: number
  audioContext: AudioContext
  noteDuration: number
  render: (props: IPRender) => ReactElement
}

export interface ISSoundfontProvider {}

type ActiveAudioNodes = Object & {
  [x: number]: Soundfont.Player
}

export const SoundfontProvider: FC<IPSoundfontProvider> = ({
  format = "mp3",
  soundfont = "MusyngKite",
  instrumentName = "acoustic_grand_piano",
  transpose,
  hostname,
  audioContext,
  noteDuration,
  render,
}) => {
  const classes = useStyles()
  const [activeAudioNodes, setActiveAudioNodes] = useState<ActiveAudioNodes>({})
  const [instrument, setInstrument] = useState<Soundfont.Player | null>(null)

  useEffect(() => {
    loadInstrument(instrumentName)
  }, [instrumentName])

  const loadInstrument = (
    instrumentName: IPSoundfontProvider["instrumentName"]
  ) => {
    setInstrument(null)

    if (instrumentName)
      Soundfont.instrument(audioContext, instrumentName, {
        format,
        soundfont,
        nameToUrl: (
          name: string,
          soundfont: IPSoundfontProvider["soundfont"],
          format: IPSoundfontProvider["format"]
        ) => {
          return `${hostname}/${soundfont}/${name}-${format}.js`
        },
      }).then((instrument) => {
        setInstrument(instrument)
      })
  }

  const playNote = (midiNumber: number) => {
    midiNumber += transpose
    audioContext.resume().then(() => {
      if (instrument) {
        const audioNode = instrument.play(
          midiNumber.toString(),
          audioContext.currentTime,
          { duration: noteDuration }
        )
        setActiveAudioNodes(
          Object.assign({}, activeAudioNodes, {
            [midiNumber]: audioNode,
          })
        )
      }
    })
  }

  const stopNote = (midiNumber: number) => {
    midiNumber += transpose
    audioContext.resume().then(() => {
      if (!activeAudioNodes[midiNumber]) {
        return
      }
      const audioNode = activeAudioNodes[midiNumber]
      audioNode.stop()
      setActiveAudioNodes(
        Object.assign({}, activeAudioNodes, {
          [midiNumber]: null,
        })
      )
    })
  }

  // Clear any residual notes that don't get called with stopNote
  const stopAllNotes = () => {
    audioContext.resume().then(() => {
      const activeAudioNodesArray = Object.values(activeAudioNodes)
      activeAudioNodesArray.forEach((node) => {
        if (node) {
          node.stop()
        }
      })
      setActiveAudioNodes({})
    })
  }

  return render({
    isLoading: !instrument,
    playNote,
    stopNote: () => {},
    // stopNote,
    stopAllNotes,
  })
}
