import type { AppProps } from 'next/app'

import { PlayerProvider } from '../contexts/PlayerContext'

import { Header } from '../components/Header'
import { Player } from '../components/Player'

import '../styles/global.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerProvider>
      <div className="flex ">
        <main className="flex-1">
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerProvider>
  )
}

export default MyApp
