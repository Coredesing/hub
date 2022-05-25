import fs from 'fs'
import ethers from 'ethers'
import { GraphQLClient, gql } from 'graphql-request'
import raw from './data.js'

if (!process.env.BITQUERY_TOKEN) {
  console.error('Please specify Bitquery API token')
  console.log('BITQUERY_TOKEN=token ts-node-esm token-to-deployers.ts')
  process.exit(1)
}

type Game = {
  id: string;
  slug: string;
  token: {
    network: string;
    address: string;
  };
  deployer?: string;
  related?: {
    network: string;
    address: string;
  }[];
}

const networks = {
  bsc: 'bsc',
  eth: 'ethereum',
  polygon: 'matic'
}

const games = raw?.data?.projects?.data.map(({ id, attributes }): Game => {
  return {
    id,
    slug: attributes?.slug,
    token: {
      network: attributes?.tokenomic?.network?.[0]?.name,
      address: attributes?.tokenomic?.network?.[0]?.address.toLowerCase()
    }
  }
})

const gamesValid = games.filter(game => {
  if (!game?.token?.network || !game?.token?.address) {
    return false
  }

  try {
    ethers.utils.getAddress(game?.token?.address)
  } catch (err) {
    return false
  }

  return true
})

const gamesValidByNetwork = gamesValid.reduce((acc, val) => {
  const network = networks[val?.token?.network]
  if (!network) {
    console.error('unsupported network', val)
    return acc
  }

  if (acc[network]) {
    acc[network].push(val)
    return acc
  }

  acc[network] = [val]
  return acc
}, {})

const client = new GraphQLClient('https://graphql.bitquery.io', { headers: { 'X-API-KEY': process.env.BITQUERY_TOKEN } })
const promises = Object.keys(gamesValidByNetwork).map(network => {
  return new Promise(resolve => {
    const query = gql`
query ($network: EthereumNetwork, $in: [String!]) {
  ethereum(network: $network) {
    smartContractCalls(
      smartContractMethod: {is: "Contract Creation"}
      smartContractAddress: {in: $in}
    ) {
      smartContract {
        address {
          address
        }
      }
      transaction {
        hash
        txFrom {
          address
        }
      }
    }
  }
}
`
    client.request(query, {
      network,
      in: gamesValidByNetwork[network].map(game => game?.token?.address)
    }).then(data => {
      resolve({
        network,
        result: data?.ethereum?.smartContractCalls
      })
    })
  })
})
const related = (network, deployers) => {
  return new Promise(resolve => {
    const query = gql`
query ($network: EthereumNetwork, $in: [String!]) {
  ethereum(network: $network) {
    smartContractCalls(
      smartContractMethod: {is: "Contract Creation"}
      caller: {in: $in}
    ) {
      smartContract {
        address {
          address
        }
      }
      transaction {
        txFrom {
          address
        }
      }
    }
  }
}

`
    client.request(query, {
      network,
      in: deployers
    }).then(data => {
      resolve({
        network,
        result: data?.ethereum?.smartContractCalls
      })
    })
  })
}

Promise.all(promises).then((outputs: { network: string; result: any[] }[]) => {
  // outputs: contract -> deployer
  const relatedContracts = outputs.map(({ network, result }) => {
    return related(network, result.reduce((acc, val) => {
      acc.push(val?.transaction?.txFrom?.address)
      return acc
    }, []))
  })

  Promise.all(relatedContracts).then(outputs => {
    const contractToDeployer = outputs.map(({ network, result }) => {
      return {
        network,
        data: result.reduce((acc, val) => {
          if (!acc[val?.transaction?.txFrom?.address]) {
            acc[val?.transaction?.txFrom?.address] = []
          }

          acc[val?.transaction?.txFrom?.address].push(val?.smartContract?.address?.address)
          return acc
        }, {})
      }
    })

    const final = gamesValid.map(game => {
      const network = networks[game.token?.network]
      const contract = game.token?.address
      const mapping = contractToDeployer.find(x => x.network === network)?.data
      Object.entries(mapping).forEach(([key, value]: [string, any[]]) => {
        if (value.indexOf(contract) === -1) {
          return
        }

        game.deployer = key
        game.related = value.filter(x => x !== contract).map(addr => ({ network, address: addr }))
      })
      return game
    })

    fs.writeFileSync('related-contracts.json', JSON.stringify(final, null, 2))
  })
})
