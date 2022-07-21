import { gql } from '@apollo/client'

export const GET_FAVORITE_BY_USER_ID = gql`
  query favorite($walletAddress: String $objectID: String) {
    favorites(filters: { objectID: {eq: $objectID} user: { walletAddress: { eq: $walletAddress } } }) {
      data {
        id,
        attributes{type, user{data{attributes{username}}}, objectID}
      }
    }
  }
`

export const GET_TOTAL_FAVORITES = gql`
  query favorite($objectID: String) {
    favorites(filters: { objectID: { eq: $objectID }, type: {eq: "guild"} }) {
      meta {
        pagination {
          total
        }
      }
      data {
        attributes {
          objectID
          user {
            data {
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`

export const GET_GUILD_REVIEWS_BY_SLUG = gql`
    query GuildReviews(
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
                                    filters: { guild: { slug: { eq: $slug } } }
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

        five: rates(
            filters: { guild: { slug: { eq: $slug } }, rate: { eq: 5 } }
        ) {
            meta {
                pagination {
                    total
                }
            }
        }

        four: rates(
            filters: { guild: { slug: { eq: $slug } }, rate: { eq: 4 } }
        ) {
            meta {
                pagination {
                    total
                }
            }
        }

        three: rates(
            filters: { guild: { slug: { eq: $slug } }, rate: { eq: 3 } }
        ) {
            meta {
                pagination {
                    total
                }
            }
        }

        two: rates(
            filters: { guild: { slug: { eq: $slug } }, rate: { eq: 2 } }
        ) {
            meta {
                pagination {
                    total
                }
            }
        }

        one: rates(
            filters: { guild: { slug: { eq: $slug } }, rate: { eq: 1 } }
        ) {
            meta {
                pagination {
                    total
                }
            }
        }

        totalReviewMeta: reviews(
            filters: {
                guild: { slug: { eq: $slug } }
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

export const GET_GUILD_BY_SLUG = gql`
    query Guild($slug: String!) {
        guilds(filters: { slug: { eq: $slug } }) {
            data {
                id
                attributes {
                    name
                }
            }
        }
    }
`
