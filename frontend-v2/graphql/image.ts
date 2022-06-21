import { gql } from '@apollo/client'

export const UploadFileRelationResponseCollection = gql`
  fragment UploadFileRelationResponseCollection on UploadFileRelationResponseCollection {
    data {
      attributes {
        name,
        provider,
        url
      }
    }
  }
`
