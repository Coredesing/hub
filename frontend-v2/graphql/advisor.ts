import { gql } from '@apollo/client'

export const GET_ADVISORS = gql`
  query Advisors {
    advisors {
      data {
        attributes {
          name,
          url,
          logo {
            data {
              attributes {
                name,
                url
              }
            }
          },
          projects {
            data {
              attributes {
                name,
                tokenomic
              }
            }
          }
        }
      }
    }
  }
`
