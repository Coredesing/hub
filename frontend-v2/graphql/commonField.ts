import { gql } from '@apollo/client'

export const CommonField = gql`
fragment ReviewEntityResponseCollection on ReviewEntityResponseCollection {
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
              filters: { or: [{aggregator: { slug: { eq: $slug } }}, { guild: { slug: { eq: $slug } } }] }
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
`
