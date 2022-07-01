import { API_CMS_URL } from '@/utils/constants'
import {
  ApolloClient,
  InMemoryCache,
  DefaultOptions,
  createHttpLink
} from '@apollo/client'
// import { useMyWeb3 } from '@/components/web3/context'
import { setContext } from '@apollo/client/link/context'

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
}

const httpLink = createHttpLink({
  uri: `${API_CMS_URL}/graphql`
})

const b64 = (str: string): string => {
  return Buffer.from(str).toString('base64')
}

const authLink = setContext((_, { headers }) => {
  const token = process.env.CMS_TOKEN

  return {
    headers: {
      ...headers,
      authorization: token ? `Basic ${b64(token)}` : undefined
    }
  }
})

export const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
  link: authLink.concat(httpLink)
})

export const clientNew = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})
