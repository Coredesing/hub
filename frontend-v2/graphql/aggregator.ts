import { gql } from '@apollo/client'
import { UploadFileRelationResponseCollection } from '@/graphql/image'

export const GET_AGGREGATORS_HOME = gql`
  query Categories {
    categories(pagination: { page: 1, pageSize: 5 }, sort: "totalGames:desc") {
      data {
        id
        attributes {
          name
          totalGames
          slug
        }
      }
    }

    topPlayer: aggregators(
      sort: "project.tokenomic.totalHolders:desc"
      pagination: { pageSize: 8 }
    ) {
      data {
        attributes {
          name
          slug
          verticalThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          project {
            data {
              attributes {
                tokenomic {
                  currentPrice
                  priceChange24h
                  totalHolders
                  icon {
                    data {
                      attributes {
                        name
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    topROI: aggregators(pagination: { pageSize: 5 }, sort: "roi:desc") {
      data {
        attributes {
          name
          slug
          rate
          roi
          rectangleThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
        }
      }
    }

    gameBanners: aggregators(
      pagination: { pageSize: 10 }
      filters: { displayArea: { eq: "topGame" } }
    ) {
      data {
        attributes {
          name
          slug
          totalVotes
          releaseStatus
          releaseDate
          rate
          project {
            data {
              attributes {
                shortDesc
                banner {
                  data {
                    attributes {
                      name
                      url
                    }
                  }
                }
                categories {
                  data {
                    attributes {
                      name
                      slug
                    }
                  }
                }
                studio {
                  id
                  name
                  teamMembers {
                    id
                    name
                  }
                }
                tokenomic {
                  network {
                    id
                    name
                  }
                  marketCap
                  currentPrice
                  priceChange24h
                  cmcId
                }
              }
            }
          }
        }
      }
    }
  }
`
export const GET_BANNER_AGGREGATORS = gql`
  query Aggregators {
    aggregators(
      pagination: { pageSize: 10 }
      filters: { displayArea: { eq: "topGame" } }
    ) {
      data {
        id
        attributes {
          name
          slug
          totalFavorites
          releaseStatus
          releaseDate
          rate
          youtubeLinks {
            url
            videoThumbnail {
              data {
                attributes {
                  url
                }
              }
            }
          }
          project {
            data {
              attributes {
                shortDesc
                banner {
                  data {
                    attributes {
                      name
                      url
                    }
                  }
                }
                categories {
                  data {
                    attributes {
                      name
                      slug
                    }
                  }
                }
                studio {
                  id
                  name
                  teamMembers {
                    id
                    name
                  }
                }
                tokenomic {
                  network {
                    id
                    name
                  }
                  marketCap
                  currentPrice
                  priceChange24h
                  cmcId
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_TOP_PLAYER_AGGREGATORS = gql`
  query Aggregators($filtersValue: AggregatorFiltersInput) {
    aggregators(
      filters: $filtersValue
      sort: "project.tokenomic.totalHolders:desc"
      pagination: { pageSize: 8 }
    ) {
      data {
        attributes {
          name
          slug
          verticalThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          project {
            data {
              attributes {
                tokenomic {
                  currentPrice
                  priceChange24h
                  totalHolders
                  icon {
                    data {
                      attributes {
                        name
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
export const GET_TRENDING_AGGREGATORS = gql`
  query Aggregators {
    aggregators(pagination: { pageSize: 15 }, sort: "interactivePoint7d:desc") {
      data {
        id
        attributes {
          name
          rate
          totalViews
          totalFavorites
          slug
          verticalThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          mobileThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          project {
            data {
              attributes {
                tokenomic {
                  icon {
                    data {
                      attributes {
                        name
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
export const GET_RATING_AGGREGATORS = gql`
  query Aggregators($filtersValue: String) {
    aggregators(
      pagination: { pageSize: 15 }
      sort: ["rate:desc", $filtersValue]
    ) {
      data {
        id
        attributes {
          name
          totalViews
          rate
          totalFavorites
          slug
          verticalThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          mobileThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          project {
            data {
              attributes {
                tokenomic {
                  icon {
                    data {
                      attributes {
                        name
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
export const GET_TOP_FAVORITE_AGGREGATORS = gql`
  query Aggregators {
    aggregators(pagination: { pageSize: 15 }, sort: ["totalFavorites:desc"]) {
      data {
        attributes {
          name
          totalViews
          rate
          totalFavorites
          slug
          verticalThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          mobileThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          project {
            data {
              attributes {
                tokenomic {
                  icon {
                    data {
                      attributes {
                        name
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_TOP_ROI_AGGREGATORS = gql`
  query Aggregators {
    aggregators(pagination: { pageSize: 5 }, sort: "roi:desc") {
      data {
        attributes {
          name
          slug
          rate
          roi
          rectangleThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
        }
      }
    }
  }
`
export const GET_LAUNCHED_AGGREGATORS = gql`
  query Aggregators {
    aggregators(
      pagination: { pageSize: 5 }
      sort: ["roi:desc", "rate:desc", "interactivePoint:desc"]
      filters: { project: { isLaunchedGameFi: { eq: true } } }
    ) {
      data {
        id
        attributes {
          name
          slug
          rectangleThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
        }
      }
    }
  }
`
export const GET_RELEASED_AGGREGATORS = gql`
  query Aggregators {
    aggregators(
      pagination: { pageSize: 5 }
      sort: [
        "releaseDate:desc"
        "project.tokenomic.volume24h:desc"
        "interactivePoint:desc"
        "rate:desc"
      ]
    ) {
      data {
        id
        attributes {
          name
          rate
          totalViews
          slug
          releaseDate
          rectangleThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          project {
            data {
              attributes {
                tokenomic {
                  volume24h
                }
              }
            }
          }
        }
      }
    }
  }
`
export const GET_VIEW_AGGREGATORS = gql`
  query Aggregators($filtersValue: String) {
    aggregators(pagination: { pageSize: 5 }, sort: [$filtersValue]) {
      data {
        attributes {
          name
          totalViews
          totalViews7d
          totalViews30d
          totalViews90d
          totalFavorites
          slug
          rectangleThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
        }
      }
    }
  }
`

export const GET_LISTING_AGGREGATORS = gql`
  ${UploadFileRelationResponseCollection}
  query Aggregators(
    $filtersValue: AggregatorFiltersInput
    $sortValue: [String]
    $paginationValue: PaginationArg
  ) {
    aggregators(
      filters: $filtersValue
      sort: $sortValue
      pagination: $paginationValue
    ) {
      meta {
        pagination {
          pageCount
        }
      }
      data {
        id
        attributes {
          name
          slug
          gallery {
            ...UploadFileRelationResponseCollection
          }
          project {
            data {
              attributes {
                shortDesc
                categories {
                  data {
                    attributes {
                      name
                      slug
                    }
                  }
                }
                tokenomic {
                  network {
                    id
                    name
                  }
                  tokenSymbol
                  marketCap
                  currentPrice
                  priceChange24h
                  volume24h
                  priceChange7d
                  cmcId
                }
              }
            }
          }
        }
      }
    }
  }
`
export const GET_REVIEWS_AGGREGATORS = gql`
  query Aggregators {
    aggregators(
      pagination: { pageSize: 4 }
      sort: "interactivePoint7d:desc"
      filters: {
        totalVotes: { gt: 5 }
        reviews: { review: { ne: "" }, status: { eq: "published" } }
      }
    ) {
      data {
        id
        attributes {
          name
          slug
          totalReviews
          totalVotes
          verticalThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          reviews(
            pagination: { pageSize: 3 }
            sort: "interactivePoint:desc"
            filters: { status: { eq: "published" } }
          ) {
            data {
              id
              attributes {
                review
                likeCount
                dislikeCount
                commentCount
                author {
                  data {
                    id
                    attributes {
                      username
                      rates {
                        data {
                          attributes {
                            rate
                            aggregator {
                              data {
                                attributes {
                                  slug
                                }
                              }
                            }
                          }
                        }
                      }
                      avatar {
                        data {
                          attributes {
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_AGGREGATORS_BY_SLUG = gql`
  ${UploadFileRelationResponseCollection}
  query Aggregators(
    $slug: String
    $reviewFilterValue: ReviewFiltersInput
    $pageSize: Int
  ) {
    reviews(
      filters: $reviewFilterValue
      pagination: { pageSize: $pageSize }
      sort: "publishedAt:desc"
    ) {
      meta {
        pagination {
          total
        }
      }
      data {
        id
        attributes {
          title
          review
          publishedAt
          likeCount
          dislikeCount
          commentCount
          author {
            data {
              id
              attributes {
                walletAddress
                reviewCount
                firstName
                lastName
                level
                rank
                avatar {
                  data {
                    id
                    attributes {
                      name
                      url
                    }
                  }
                }
                rates(
                  pagination: { pageSize: 1 }
                  filters: { aggregator: { slug: { eq: $slug } } }
                ) {
                  data {
                    id
                    attributes {
                      rate
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    aggregators(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          roi
          igoDate
          name
          slug
          rate
          introduction
          youtubeLinks {
            url
            videoThumbnail {
              data {
                id
                attributes {
                  url
                }
              }
            }
          }
          totalViews
          totalFavorites
          totalReviews
          mobileThumbnail {
            data {
              id
              attributes {
                url
              }
            }
          }
          rectangleThumbnail {
            data {
              id
              attributes {
                url
              }
            }
          }
          gameDownloads {
            type
            link
          }
          playMode
          playToEarnModel
          releaseStatus
          ranking {
            cmcRank
            gamefiRank
            coingeckoRank
            cryptoRank
          }
          gallery {
            ...UploadFileRelationResponseCollection
          }
          project {
            data {
              id
              attributes {
                isVerifiedGameFi
                twitterId
                name
                logo {
                  data {
                    id
                    attributes {
                      url
                    }
                  }
                }
                guilds {
                  data {
                    id
                    attributes {
                      slug
                      logo {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                      name
                      region
                      discordMember
                      scholarship
                    }
                  }
                }
                communityOfficial {
                  website
                  telegram
                  facebook
                  twitch
                  reddit
                  medium
                  discordServer
                  twitter
                  youtube
                  tiktok
                  instagram
                  telegramANN
                }
                shortDesc
                roadmap
                highlightFeatures
                categories {
                  data {
                    id
                    attributes {
                      name
                      slug
                    }
                  }
                }
                backers(pagination: { pageSize: 100 }) {
                  data {
                    id
                    attributes {
                      logo {
                        data {
                          id
                          attributes {
                            url
                          }
                        }
                      }
                      link
                      twitter
                    }
                  }
                }
                advisor {
                  name
                  avatar {
                    data {
                      id
                      attributes {
                        url
                      }
                    }
                  }
                  telegram
                  twitter
                  linkedIn
                  desc
                }
                studio {
                  name
                  teamMembers(pagination: { pageSize: 100 }) {
                    position
                    name
                    avatar {
                      data {
                        id
                        attributes {
                          url
                        }
                      }
                    }
                    link
                    desc
                  }
                }
                tokenomic {
                  network {
                    name
                    address
                  }
                  icon {
                    data {
                      id
                      attributes {
                        url
                      }
                    }
                  }
                  currentPrice
                  priceChange24h
                  marketCap
                  selfReportedMarketCap
                  chartSymbol
                  volume24h
                  volumeChange24h
                  tokenSymbol
                  publicPrice
                  totalSupply
                  valuation
                  initTokenCirculation
                  initMarketCap
                  tokenUtilities
                  tokenEconomy
                  tokenDistribution
                  vestingSchedule
                }
              }
            }
          }
        }
      }
    }

    five: rates(
      filters: { aggregator: { slug: { eq: $slug } }, rate: { eq: 5 } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    four: rates(
      filters: { aggregator: { slug: { eq: $slug } }, rate: { eq: 4 } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    three: rates(
      filters: { aggregator: { slug: { eq: $slug } }, rate: { eq: 3 } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    two: rates(
      filters: { aggregator: { slug: { eq: $slug } }, rate: { eq: 2 } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    one: rates(
      filters: { aggregator: { slug: { eq: $slug } }, rate: { eq: 1 } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    totalReviewMeta: reviews(
      filters: {
        aggregator: { slug: { eq: $slug } }
        status: { eq: "published" }
      }
    ) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`
export const GET_SUM_AGGREGATORS = gql`
  query Aggregators {
    aggregators {
      meta {
        pagination {
          total
        }
      }
    }
  }
`

export const GET_MORE_LIKE_THIS = gql`
  query Aggregators($filterCate: AggregatorFiltersInput) {
    aggregators(
      pagination: { pageSize: 15 }
      sort: ["rate:desc", "totalViews:desc", "totalReviews:desc"]
      filters: $filterCate
    ) {
      data {
        id
        attributes {
          name
          rate
          totalViews
          totalFavorites
          slug
          verticalThumbnail {
            data {
              attributes {
                name
                url
              }
            }
          }
          mobileThumbnail {
            data {
              attributes {
                url
              }
            }
          }
          project {
            data {
              attributes {
                shortDesc
                tokenomic {
                  icon {
                    data {
                      attributes {
                        name
                        url
                      }
                    }
                  }
                  currentPrice
                  priceChange24h
                }
                categories {
                  data {
                    id
                    attributes {
                      name
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_LISTING_AGGREGATORS_V2 = gql`
  query GetListingAggregatorV2(
    $categorySlug: String
    $aggregatorsFilterValue: AggregatorFiltersInput
    $aggregatorLaunchedFilterValue: AggregatorFiltersInput
    $aggregatorUpcomingFilterValue: AggregatorFiltersInput
    $aggregatorOfficialFilterValue: AggregatorFiltersInput
    $aggregatorTestnetFilterValue: AggregatorFiltersInput
    $aggregatorVersionUpcomingFilterValue: AggregatorFiltersInput
    $aggregatorStatusLaunchedFilterValue: AggregatorFiltersInput
    $aggregatorVerifiedFilterValue: AggregatorFiltersInput
    $sortAggregator: [String]
    $paginationValue: PaginationArg
  ) {
    aggregators(
      filters: $aggregatorsFilterValue
      sort: $sortAggregator
      pagination: $paginationValue
    ) {
      meta {
        pagination {
          page
          pageSize
          pageCount
          total
        }
      }
      data {
        id
        attributes {
          createdAt
          releaseDate
          slug
          name
          totalViews
          totalFavorites
          rate
          roi
          rectangleThumbnail {
            data {
              id
              attributes {
                url
              }
            }
          }
          mobileThumbnail {
            data {
              id
              attributes {
                url
              }
            }
          }
          verticalThumbnail {
            data {
              id
              attributes {
                url
              }
            }
          }
          project {
            data {
              id
              attributes {
                name
                tokenomic {
                  cmcId
                  icon {
                    data {
                      id
                      attributes {
                        url
                      }
                    }
                  }
                  currentPrice
                  priceChange7d
                  volume24h
                  network {
                    name
                  }
                  totalHolders
                }
              }
            }
          }
        }
      }
    }

    top5Aggregators: aggregators(
      pagination: { pageSize: 5 }
      filters: { project: { categories: { slug: { eq: $categorySlug } } } }
      sort: [
        "releaseDate:desc"
        "project.tokenomic.volume24h:desc"
        "interactivePoint:desc"
        "rate:desc"
      ]
    ) {
      data {
        id
        attributes {
          name
          slug
          gallery {
            data {
              id
              attributes {
                url
              }
            }
          }
          project {
            data {
              id
              attributes {
                name
                tokenomic {
                  cmcId
                  icon {
                    data {
                      id
                      attributes {
                        url
                      }
                    }
                  }
                  currentPrice
                  priceChange7d
                }
                shortDesc
              }
            }
          }
        }
      }
    }
    defaultTop5Aggregators: aggregators(
      pagination: { pageSize: 5 }
      filters: { project: { categories: { slug: { eq: $categorySlug } } } }
    ) {
      data {
        id
        attributes {
          name
          slug
          gallery {
            data {
              id
              attributes {
                url
              }
            }
          }
          project {
            data {
              id
              attributes {
                name
                tokenomic {
                  cmcId
                  icon {
                    data {
                      id
                      attributes {
                        url
                      }
                    }
                  }
                  currentPrice
                  priceChange7d
                }
                shortDesc
              }
            }
          }
        }
      }
    }
    category: categories(filters: { slug: { eq: $categorySlug } }) {
      data {
        id
        attributes {
          slug
          name
        }
      }
    }
    categories(pagination: { pageSize: 1000 }, sort: "priority:asc") {
      data {
        id
        attributes {
          slug
          name
          totalGames
        }
      }
    }
    aggregatorLaunched: aggregators(filters: $aggregatorLaunchedFilterValue) {
      meta {
        pagination {
          total
        }
      }
    }
    aggregatorUpcoming: aggregators(filters: $aggregatorUpcomingFilterValue) {
      meta {
        pagination {
          total
        }
      }
    }
    aggregatorOfficial: aggregators(filters: $aggregatorOfficialFilterValue) {
      meta {
        pagination {
          total
        }
      }
    }
    aggregatorTestnet: aggregators(filters: $aggregatorTestnetFilterValue) {
      meta {
        pagination {
          total
        }
      }
    }
    aggregatorVersionUpcoming: aggregators(
      filters: $aggregatorVersionUpcomingFilterValue
    ) {
      meta {
        pagination {
          total
        }
      }
    }
    aggregatorStatusLaunched: aggregators(
      filters: $aggregatorStatusLaunchedFilterValue
    ) {
      meta {
        pagination {
          total
        }
      }
    }
    aggregatorStatusVerified: aggregators(
      filters: $aggregatorVerifiedFilterValue
    ) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`

export const GET_FAVORITE_BY_USER_ID = gql`
  query favorite($userId: ID, $aggregatorId: String) {
    favorites(
      filters: {
        objectID: { eq: $aggregatorId }
        user: { id: { eq: $userId } }
        type: { eq: "aggregator" }
      }
    ) {
      data {
        id
      }
    }
  }
`

export const CUSTOM_PARTNER_ANALYTICS = gql`
query ($limit: Int, $start: Int, $limitReviews: Int, $startReviews: Int, $favoriteID: String, $reviewSlug: String) {
  favorites(pagination: {limit: $limit, start: $start}, filters: {type: { eq: "aggregator" }, objectID: { eq: $favoriteID }}) {
    meta {
      pagination {
        total
      }
    }
    data {
      id
      attributes {
        user {
          data {
            attributes {
              walletAddress
            }
          }
        }
      }
    }
  }

  reviews(pagination: {limit: $limitReviews, start: $startReviews}, filters: { aggregator: { slug: { eq: $reviewSlug } } }) {
    meta {
      pagination {
        total
      }
    }
    data {
      attributes {
        aggregator {
          data {
            id
            attributes {
              slug
            }
          }
        }
        author {
          data {
            attributes {
              walletAddress
            }
          }
        }
      }
    }
  }
}
`
