import { gql } from '@apollo/client'

export const GET_FAVORITE_BY_USER_ID = gql`
  query favorite($userId: ID $objectID: String) {
    favorites(filters: { objectID: {eq: $objectID} user: { id: { eq: $userId } } }) {
      data {
        id,
        attributes{type, user{data{attributes{username}}}, objectID}
      }
    }
  }
`

export const GET_TOTAL_FAVORITES = gql`
  query favorite($objectID: String) {
    favorites(filters: { objectID: { eq: $objectID } }) {
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
