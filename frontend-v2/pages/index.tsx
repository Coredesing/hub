import Layout from 'components/Layout'
import { useWeb3Default } from 'components/web3'

// example of default provider
function ChainId() {
  const { chainId } = useWeb3Default()

  return (
    <>
      <span>Chain Id</span>
      <span role="img" aria-label="chain">
        ⛓
      </span>
      <span>{chainId ?? ''}</span>
    </>
  )
}

const PageIndex = () => {
  return (
  <Layout title="GameFi">
    <div>
      <h1>Home</h1>
      <ChainId />
    </div>
  </Layout>)
}

export default PageIndex
