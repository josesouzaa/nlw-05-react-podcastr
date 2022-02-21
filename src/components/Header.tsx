/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMM', {
    locale: ptBR
  })

  return (
    <header
      className="bg-brandWhite flex items-center py-8 px-16 border-b border-b-brandGray-100"
      style={{ height: '6.5rem' }}
    >
      <Link href="/" passHref>
        <img src="/logo.svg" alt="Podcastr" className="cursor-pointer" />
      </Link>

      <p className="ml-8 py-1 pl-8 border-l border-l-brandGray-100">
        O melhor para você ouvir sempre
      </p>

      <span className="ml-auto capitalize">{currentDate}</span>
    </header>
  )
}
