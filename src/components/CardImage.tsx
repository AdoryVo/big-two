import Image from 'next/image'

const BASE_CARD_IMAGE_URL = 'https://raw.githubusercontent.com/hayeah/playing-cards-assets/master/png/'

const RANK_NAMES: { [abbrn: string]: string } = {
  'J': 'jack',
  'Q': 'queen',
  'K': 'king',
  'A': 'ace',
}

function cardToUrl(card: string) {
  const [rank, suit] = card.split(';')

  return BASE_CARD_IMAGE_URL + [RANK_NAMES[rank] || rank, suit].join('_of_') + '.png'
}

interface Props {
  card: string,
  border?: string,
  value?: string
}

export default function CardImage({ card, border, value }: Props) {
  return (
    <Image
      alt={card}
      src={cardToUrl(card)}
      style={{
        display: 'inline',
        width: '5em',
        height: 'auto',
        marginRight: '1em',
        border: border || 'thin solid black',
        backgroundColor: 'white',
        cursor: 'pointer',
        transform: value,
        position: 'relative',
      }}
      width={50}
      height={100}
    />
  )
}
