import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { usePlayer } from '../contexts/PlayerContext'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

/* eslint-disable @next/next/no-img-element */
export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    toggleShuffle,
    isShuffling,
    clearPlayerState
  } = usePlayer()

  const episode = episodeList[currentEpisodeIndex]

  useEffect(() => {
    if (!audioRef.current) {
      return
    }

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  function setupProgressListener() {
    if (audioRef.current !== null) {
      audioRef.current.currentTime = 0

      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setProgress(Math.floor(audioRef.current.currentTime))
        }
      })
    }
  }

  function handleSeek(amount: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = amount
      setProgress(amount)
    }
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  return (
    <div
      className="h-screen w-96 py-12 px-16 bg-brandPurple-500 text-brandWhite flex
    flex-col items-center justify-between"
    >
      <header className="flex items-center gap-4">
        <img src="/playing.svg" alt="Tocando agora" />
        <strong className="font-title font-semibold">Tocando agora</strong>
      </header>

      {episode ? (
        <div className="text-center">
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
            alt={episode.title}
            className="rounded-3xl"
          />

          <strong className="block mt-8 font-semibold text-lg font-title leading-7">
            {episode.title}
          </strong>

          <span className="block mt-4 opacity-60 leading-6">
            {episode.members}
          </span>
        </div>
      ) : (
        <div
          className="w-full h-80 border border-dashed border-brandPurple-300 rounded-3xl
        p-16 text-center flex items-center justify-center"
          style={{
            background:
              'linear-gradient(143.8deg, rgba(145, 100, 250, 0.8) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer
        className="self-stretch"
        style={{
          opacity: `${!episode ? '0.5' : '1'}`
        }}
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block w-16 text-center">
            {convertDurationToTimeString(progress)}
          </span>

          <div className="flex-1">
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className="w-full h-1 bg-brandPurple-300 rounded-sm" />
            )}
          </div>

          <span className="inline-block w-16 text-center">
            {convertDurationToTimeString(episode?.duration ?? 0)}
          </span>
        </div>

        {episode && (
          <audio
            autoPlay
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className="controllersPlayer flex items-center justify-center mt-10 gap-6">
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={`bg-transparent border-0 ${isShuffling && 'btnActive'}`}
            style={{ fontSize: '0' }}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>

          <button
            type="button"
            disabled={!episode || !hasPrevious}
            className="bg-transparent border-0"
            style={{ fontSize: '0' }}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={togglePlay}
            className="playButton bg-transparent border-0 w-16 h-16 rounded-2xl bg-brandPurple-400"
            style={{ fontSize: '0' }}
          >
            {isPlaying ? (
              <img className="mx-auto" src="/pause.svg" alt="Pausar" />
            ) : (
              <img className="mx-auto" src="/play.svg" alt="Tocar" />
            )}
          </button>

          <button
            type="button"
            disabled={!episode || !hasNext}
            className="bg-transparent border-0"
            style={{ fontSize: '0' }}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={`bg-transparent border-0 ${isLooping && 'btnActive'}`}
            style={{ fontSize: '0' }}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}
