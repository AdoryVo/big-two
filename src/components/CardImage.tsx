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

export default function CardImage({ card } : { card: string }) {
  return (
    <Image
      alt={card}
      src={cardToUrl(card)}
      style={{
        display: 'inline',
        width: '4em',
        height: 'auto',
        marginRight: '1em',
        border: 'medium double #68D391',
      }}
      width={50}
      height={100}
    />
  )
}
