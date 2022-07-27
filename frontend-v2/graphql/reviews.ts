import { gql } from '@apollo/client'

export const CREATE_REVIEW = gql`
  mutation createReview($data: ReviewInput!) {
    createReview(data: $data) {
      data {
        id
        attributes {
          title
          review
        }
      }
    }
  }
`

export const GET_LIKES_BY_USER_ID = gql`
  query getLikesByUserId($userId: ID) {
    likes(pagination: { pageSize: 100000 } filters: { user: { id: { eq: $userId } } }) {
      data {
        id
        attributes {
          status
          objectId
          objectType
        }
      }
    }
  }
`

export const GET_REVIEW_AND_RATE_BY_USER_ID_FOR_AGGREGATOR = gql`
  query getReviewByID($walletAddress: String $slug: String) {
    rates(
      filters: {
        user: { walletAddress: { eq: $walletAddress } }
        aggregator: { slug: { eq: $slug } }
      }
    ) {
      data {
        id
        attributes {
          rate
        }
      }
    }
    reviews(
      filters: {
        author: { walletAddress: { eq: $walletAddress } }
        aggregator: { slug: { eq: $slug } }
      }
    ) {
      data {
        id
        attributes {
          title
          review
          status
          cons {
            id
            text
          }
          pros {
            id
            text
          }
        }
      }
    }
  }
`

export const GET_REVIEW_AND_RATE_BY_USER_ID_FOR_GUILD = gql`
    query getReviewAndRateByUserIdForGuild($walletAddress: String $slug: String) {
        rates(
            filters: {
                user: { walletAddress: { eq: $walletAddress } }
                guild: { slug: { eq: $slug } }
            }
        ) {
            data {
                id
                attributes {
                    rate
                }
            }
        }
        reviews(
            filters: {
                author: { walletAddress: { eq: $walletAddress } }
                guild: { slug: { eq: $slug } }
            }
        ) {
            data {
                id
                attributes {
                    title
                    review
                    status
                    cons {
                        id
                        text
                    }
                    pros {
                        id
                        text
                    }
                }
            }
        }
    }
`

export const GET_USER_RATES_BY_GAME_AND_GUILD = gql`
    query getUserRatesByGameAndGuild(
      $rateFilterValue: RateFiltersInput!
    ) {
      rates(filters: $rateFilterValue) {
        data {
          id
          attributes {
            rate
            aggregator {
              data {
                attributes {
                  slug
                }
              }
            }
            guild {
              data {
                attributes {
                  slug
                }
              }
            }
          }
        }
      }
    }
`

export const GET_REVIEWS_AND_COMMENTS_BY_USER = gql`
  query getReviewsAndCommentsByUser(
    $reviewFilterValue: ReviewFiltersInput!
    $commentFilterValue: CommentFiltersInput!
    $reviewPagination: PaginationArg
    $commentPagination: PaginationArg
    $userId: ID!
  ) {
    user: usersPermissionsUser(id: $userId) {
      data {
        id
        attributes {
          walletAddress
          firstName
          lastName
          level
          rank
          likeCount
          dislikeCount
          commentCount
          reviewCount
          avatar {
            data {
              id
              attributes {
                url
              }
            }
          }
          rates(
            pagination: $reviewPagination
            sort: "createdAt:desc"
          ) {
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
                guild {
                  data {
                    attributes {
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

    reviews(
      filters: $reviewFilterValue
      pagination: $reviewPagination
      sort: "publishedAt:desc"
    ) {
      data {
        id
        attributes {
          title
          publishedAt
          createdAt
          updatedAt
          review
          likeCount
          dislikeCount
          commentCount
          status
          aggregator {
            data {
              id
              attributes {
                name
                slug
                verticalThumbnail {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          guild {
            data {
              id
              attributes {
                name
                slug
                banner { # TODO: add verticalThumbnail for guild?
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

    comments(
      filters: $commentFilterValue
      pagination: $commentPagination
      sort: "createdAt:desc"
    ) {
      data {
        id
        attributes {
          review {
            data {
              id
              attributes {
                title
                author {
                  data {
                    id
                    attributes {
                      walletAddress
                      firstName
                      lastName
                    }
                  }
                }
                aggregator {
                  data {
                    id
                    attributes {
                      name
                      slug
                      verticalThumbnail {
                        data {
                          attributes {
                            url
                          }
                        }
                      }
                    }
                  }
                }
                guild {
                  data {
                    id
                    attributes {
                      name
                      slug
                      banner { # TODO: add verticalThumbnail for guild?
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
          comment
          likeCount
          dislikeCount
          createdAt
        }
      }
    }

    publishedReview: reviews(
      filters: { author: { id: { eq: $userId } }, status: { eq: "published" } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    draftReview: reviews(
      filters: { author: { id: { eq: $userId } }, status: { eq: "draft" } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    pendingReview: reviews(
      filters: { author: { id: { eq: $userId } }, status: { eq: "pending" } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    declinedReview: reviews(
      filters: { author: { id: { eq: $userId } }, status: { eq: "declined" } }
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    commentMeta: comments(
      filters: $commentFilterValue
      sort: "createdAt:desc"
    ) {
      meta {
        pagination {
          total
        }
      }
    }

    reviewMeta: reviews(
      filters: $reviewFilterValue
    ) {
      meta {
        pagination {
          total
        }
      }
    }
  }
`

export const GET_REVIEW_BY_ID_FOR_AGGREGATOR = gql`
  query getReviewByIdForAggregator($reviewId: ID!, $pageSize: Int, $aggSlug: String) {
    reviews(filters: { id: { eq: $reviewId }, status: { eq: "published" } }) {
      data {
        id
        attributes {
          review
          status
          likeCount
          dislikeCount
          commentCount
          publishedAt
          author {
            data {
              id
              attributes {
                walletAddress
                firstName
                lastName
                level
                rank
                repPoint
                reviewCount
                reviews {
                  data {
                    id
                  }
                }
                avatar {
                  data {
                    attributes {
                      name
                      url
                    }
                  }
                }
                rates(filters: {
                  aggregator: {
                    slug: {
                      eq: $aggSlug
                    }
                  }
                }) {
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
          pros {
            id
            text
          }
          cons {
            id
            text
          }
          aggregator {
            data {
              attributes {
                slug
                name
              }
            }
          }
        }
      }
    }
    comments(
      filters: { review: { id: { eq: $reviewId } } }
      pagination: { pageSize: $pageSize }
      sort: "createdAt:asc"
    ) {
      meta {
        pagination {
          total
        }
      }
      data {
        id
        attributes {
          comment
          likeCount
          dislikeCount
          user {
            data {
              id
              attributes {
                walletAddress
                firstName
                lastName
                rank
                level
                avatar {
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
`

export const GET_REVIEW_BY_ID_FOR_GUILD = gql`
    query getReviewByIdForGuild($reviewId: ID!, $pageSize: Int, $guildSlug: String) {
        reviews(filters: { id: { eq: $reviewId }, status: { eq: "published" } }) {
            data {
                id
                attributes {
                    review
                    status
                    likeCount
                    dislikeCount
                    commentCount
                    publishedAt
                    author {
                        data {
                            id
                            attributes {
                                walletAddress
                                firstName
                                lastName
                                level
                                rank
                                repPoint
                                reviewCount
                                reviews {
                                    data {
                                        id
                                    }
                                }
                                avatar {
                                    data {
                                        attributes {
                                            name
                                            url
                                        }
                                    }
                                }
                                rates(filters: {
                                    guild: {
                                        slug: {
                                            eq: $guildSlug
                                        }
                                    }
                                }) {
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
                    pros {
                        id
                        text
                    }
                    cons {
                        id
                        text
                    }
                    guild {
                        data {
                            attributes {
                                slug
                                name
                            }
                        }
                    }
                }
            }
        }
        comments(
            filters: { review: { id: { eq: $reviewId } } }
            pagination: { pageSize: $pageSize }
            sort: "createdAt:asc"
        ) {
            meta {
                pagination {
                    total
                }
            }
            data {
                id
                attributes {
                    comment
                    likeCount
                    dislikeCount
                    user {
                        data {
                            id
                            attributes {
                                walletAddress
                                firstName
                                lastName
                                rank
                                level
                                avatar {
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
`
