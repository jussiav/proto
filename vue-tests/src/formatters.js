export const t = (key, count) => {
  const map = {
    'auction.auction_details.bids': count === 1 ? 'Tarjous' : 'Tarjousta',
    'auction.auction_details.buyers': count === 1 ? 'Autoliike' : 'Autoliikettä',
    'auction.auction_details.expected_price': 'Odotettu hinta',
    // AuctionStats — Timer.vue's own labels. No plural forms in production.
    'auction.landing.auctions_in_progress.total_bids': 'Tarjouksia yhteensä',
    'auction.landing.auctions_in_progress.bidders': 'Tarjoajat',
  }
  return map[key] ?? key
}

export const currency = (value) => {
  if (typeof value !== 'number' || isNaN(value)) return null
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}
