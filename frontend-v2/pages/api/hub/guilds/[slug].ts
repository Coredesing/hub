import { client } from '@/graphql/apolloClient'
import { GET_GUILD_BY_SLUG } from '@/graphql/guilds'

export function callWidthGraphql (slug) {
  return client.query({
    query: GET_GUILD_BY_SLUG,
    variables: { slug }
  })
}
