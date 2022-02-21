/* eslint-disable @next/next/no-img-element */
import { GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'

import { api } from '../services/api'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'
import { usePlayer } from '../contexts/PlayerContext'

type EpisodeRaw = {
  id: any
  title: any
  thumbnail: any
  members: any
  published_at: string
  file: { duration: any; url: any }
}

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  duration: number
  durationAsString: string
  url: string
  publishedAt: string
}

type HomeProps = {
  latestEpisodes: Episode[]
  allEpisodes: Episode[]
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer()

  const episodeList = [...latestEpisodes, ...allEpisodes]

  return (
    <div
      className="px-16 overflow-y-scroll"
      style={{ height: 'calc(100vh - 6.5rem)' }}
    >
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className="">
        <h2 className="mt-12 mb-6">Últimos lançamentos</h2>

        <ul className="grid grid-cols-2 gap-6">
          {latestEpisodes.map((episode, index) => (
            <li
              key={episode.id}
              className="bg-brandWhite border border-brandGray-100 p-5 rounded-3xl relative
              flex items-center"
            >
              <Image
                width={192}
                height={192}
                objectFit={'cover'}
                src={episode.thumbnail}
                alt={episode.title}
                className="w-24 h-24 rounded-2xl"
              />

              <div className="flex-1 ml-4">
                <Link href={`/episodes/${episode.id}`}>
                  <a className="block text-brandGray-800 font-title font-semibold leading-6 hover:underline">
                    {episode.title}
                  </a>
                </Link>
                <p
                  className="text-sm mt-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ maxWidth: '70%' }}
                >
                  {episode.members}
                </p>
                <span className="inline-block mt-2 text-sm mr-2 firstSpanHome">
                  {episode.publishedAt}
                </span>
                <span className="inline-block mt-2 text-sm">
                  {episode.durationAsString}
                </span>
              </div>

              <button
                type="button"
                onClick={() => playList(episodeList, index)}
                className="absolute right-8 bottom-8 w-10 h-10 bg-brandWhite border border-brandGray-100 rounded-xl hover:brightness-95 transition"
              >
                <img
                  src="/play-green.svg"
                  alt="Tocas episódio"
                  className="w-6 h-6 mx-auto"
                />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="allEpisodes pb-8">
        <h2 className="mt-12 mb-6">Todos episódios</h2>

        <table cellSpacing={0} className="w-full">
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map((episode, index) => (
              <tr key={episode.id}>
                <td className="w-20">
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                    className="w-10 h-10 rounded-lg"
                  />
                </td>

                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a
                      className="text-brandGray-800 font-title font-semibold leading-6 text-base
                    hover:underline"
                    >
                      {episode.title}
                    </a>
                  </Link>
                </td>

                <td>{episode.members}</td>

                <td className="w-28">{episode.publishedAt}</td>

                <td>{episode.durationAsString}</td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      playList(episodeList, index + latestEpisodes.length)
                    }
                    className="w-8 h-8 bg-brandWhite border border-brandGray-100 rounded-lg hover:brightness-95 transition"
                  >
                    <img
                      src="/play-green.svg"
                      alt="Tocar episódio"
                      className="w-5 h-5 mx-auto"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map((episode: EpisodeRaw) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR
      }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(
        Number(episode.file.duration)
      ),
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }
}
