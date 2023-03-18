import Image from 'next/image'
import type { CSSProperties } from 'react'

import { getTheme } from '@utils/theme'


const RANK_NAMES: { [abbrn: string]: string } = {
  'J': 'jack',
  'Q': 'queen',
  'K': 'king',
  'A': 'ace',
}

interface Props {
  card: string,
  selected?: boolean,
  theme?: string,
  style?: CSSProperties
}

export default function CardImage({
  card, selected, theme, style,
}: Props) {
  function cardToUrl(card: string) {
    const [rank, suit] = card.split(';')

    if (!rank) {
      return '/assets/cards/classic/back.png'
    }

    return `/assets/cards/${theme || getTheme()}/${[RANK_NAMES[rank] || rank, suit].join('_of_')}.png`
  }

  return (
    <Image
      alt={card}
      src={cardToUrl(card)}
      style={{
        display: 'inline',
        width: '6em',
        height: '8.2em',
        marginRight: '1em',
        border: selected ? 'thin solid #68D391' : 'thin solid black',
        backgroundColor: 'white',
        cursor: 'pointer',
        transform: selected ? 'translate(0, -1em)' : '',
        position: 'relative',
        ...style,
      }}
      width={50}
      height={100}
      draggable={false}
    />
  )
}
