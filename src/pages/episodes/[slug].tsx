/* eslint-disable @next/next/no-img-element */
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

import { api } from '../../services/api'
import { usePlayer } from '../../contexts/PlayerContext'

import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  duration: number
  durationAsString: string
  url: string
  publishedAt: string
  description: string
}

type EpisodeProps = {
  episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer()

  return (
    <div className="max-w-3xl py-12 px-8 mx-auto">
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className="relative">
        <Link href={'/'} passHref>
          <button
            type="button"
            style={{ transform: 'translate(-50%, -50%)' }}
            className="w-12 h-12 rounded-xl absolute z-10 hover:brightness-95 transition left-0 top-1/2
          bg-brandPurple-500"
          >
            <img className="mx-auto" src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
          alt={episode.title}
          className="rounded-2xl"
        />

        <button
          type="button"
          style={{ transform: 'translate(50%, -50%)' }}
          className="w-12 h-12 rounded-xl absolute z-10 hover:brightness-95 transition right-0 top-1/2
          bg-brandGreen-500"
          onClick={() => play(episode)}
        >
          <img className="mx-auto" src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header className="pb-4 border-b border-brandGray-100">
        <h1 className="mt-8 mb-6">{episode.title}</h1>

        <span className="inline-block text-sm">{episode.members}</span>

        <span className="descriptionSpan inline-block text-sm ml-4 pl-4 relative">
          {episode.publishedAt}
        </span>

        <span className="descriptionSpan inline-block text-sm ml-4 pl-4 relative">
          {episode.durationAsString}
        </span>
      </header>

      <div
        dangerouslySetInnerHTML={{ __html: episode.description }}
        className="descriptionText mt-8 leading-6 text-brandGray-800"
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

interface Props {
  slug: string
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR
    }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url
  }

  return {
    props: { episode },
    revalidate: 60 * 60 * 24
  }
}
