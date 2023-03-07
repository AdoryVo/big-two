import Image from 'next/image'
import { CSSProperties } from 'react'

import { getTheme } from '../lib/theme'

const BASE_CARD_IMAGE_URL = '/assets/cards/'

const RANK_NAMES: { [abbrn: string]: string } = {
  'J': 'jack',
  'Q': 'queen',
  'K': 'king',
  'A': 'ace',
}

interface Props {
  card: string,
  border?: string,
  value?: string,
  theme?: string,
  style?: CSSProperties
}

export default function CardImage({
  card, border, value, theme, style,
}: Props) {
  function cardToUrl(card: string) {
    const [rank, suit] = card.split(';')

    if (!rank) {
      return '/assets/cards/classic/back.png'
    }

    return `${BASE_CARD_IMAGE_URL}${theme || getTheme()}/${[RANK_NAMES[rank] || rank, suit].join('_of_')}.png`
  }

  return (
    <Image
      alt={card}
      src={cardToUrl(card)}
      style={{
        display: 'inline',
        width: '6em',
        height: 'auto',
        marginRight: '1em',
        border: border || 'thin solid black',
        backgroundColor: 'white',
        cursor: 'pointer',
        transform: value,
        position: 'relative',
        ...style,
      }}
      width={50}
      height={100}
    />
  )
}
