import { fetchOneWithSlug } from 'pages/api/aggregator'
import Layout from 'components/Layout'
import { formatterUSD, formatPrice, fetcher, printNumber } from 'utils'
import PriceChange from 'components/Pages/Aggregator/PriceChange'
import Link from 'next/link'
import { Carousel } from 'react-responsive-carousel'
import { TabPanel, Tabs } from 'components/Base/Tabs'
import { useState, useCallback, useMemo } from 'react'
import { useMyWeb3 } from 'components/web3/context'
import useSWR, { useSWRConfig } from 'swr'

const GameDetails = ({ data }) => {
  const roi = ((parseFloat(data.tokenomic?.price) || 0) / parseFloat(data.token_price)).toFixed(2)
  const items = [data.screen_shots_1, data.screen_shots_2, data.screen_shots_3, data.screen_shots_4, data.screen_shots_5].filter(x => !!x)
  const [tab, setTab] = useState(0)

  const { account, library } = useMyWeb3()
  const [signature, setSignature] = useState('')
  const { mutate } = useSWRConfig()
  const { data: likes } = useSWR(account ? `/api/aggregator/liked/${account}` : null, fetcher)
  const liked = useMemo(() => {
    if (!likes?.data) {
      return false
    }

    return !!likes.data.find(x => x.game_id === data.id)
  }, [data, likes])
  const like = useCallback(async (game) => {
    if (!library) {
      return
    }

    let sign = signature
    if (!sign) {
      const signer = library.getSigner()
      sign = await signer.signMessage('GameFi User Message')
    }

    setSignature(sign)
    await fetcher(`/api/aggregator/like/${game.id}`, { method: 'POST', body: JSON.stringify({ address: account, signature: sign, status: !liked }) })
    await mutate(`/api/aggregator/liked/${account}`)
  }, [library, liked, mutate, signature, account])

  return (
    <Layout title={data.game_name}>
      <div className="px-2 md:px-4 lg:px-24 md:container mx-auto lg:block">
        <Link href="/aggregator" passHref={true}>
          <a className="inline-flex items-center text-sm font-casual mb-6 hover:text-gamefiGreen-500">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5 8.5H1.5" stroke="currentColor" strokeMiterlimit="10"/>
              <path d="M8.5 15.5L1.5 8.5L8.5 1.5" stroke="currentColor" strokeMiterlimit="10" strokeLinecap="square"/>
            </svg>
            Back {liked}
          </a>
        </Link>
        <div className="uppercase font-bold text-3xl mb-6">{data.game_name}</div>
        <div className="flex flex-col md:flex-row font-casual gap-10">
          <div className="md:w-8/12 relative">
            <Carousel
              showStatus={false}
              showIndicators={false}
              showArrows={false}
              autoPlay={true}
              stopOnHover={true}
              showThumbs={true}
              thumbWidth={170}
              swipeable={true}
              infiniteLoop={true}
              interval={3000}
              renderThumbs={() => {
                /* eslint-disable-next-line @next/next/no-img-element */
                return items && items.length > 1 && items.map((item) => <img key={item} src={item} alt="img" />)
              }}
            >
              {items.map(item => (
                <div key={item} className="px-px">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item} className="w-full" style={{ aspectRatio: '16/9' }} alt={data.game_name} />
                </div>
              ))}
            </Carousel>

            <Tabs
              titles={[
                'About Game',
                'Tokenomics',
                'Team'
              ]}
              currentValue={tab}
              onChange={setTab}
              className="mt-10"
            />

            <div className="mt-6 mb-10 editor-content text-gray-200 leading-6">
              <TabPanel value={tab} index={0}>
                <div className="mt-6"><strong>Introduction</strong></div>
                <div dangerouslySetInnerHTML={{ __html: data.game_intro }}></div>
                { data.game_features && <>
                  <div className="mt-6"><strong>Highlight Features</strong></div>
                  <div dangerouslySetInnerHTML={{ __html: data.game_features }}></div>
                </>
                }

                { data.system_require && <>
                  <div className="mt-6"><strong>System Requirements</strong></div>
                  <div dangerouslySetInnerHTML={{ __html: data.system_require }}></div>
                </>
                }

                <div className="h-px bg-gradient-to-r from-gray-300 my-8"></div>

                { data.hashtags && <>
                  <div className="mt-6"><strong>Tags</strong></div>
                  {data.hashtags.split(',').map(tag => <div key={tag} className="m-1 inline-block px-3 py-1 bg-gamefiDark-500 rounded text-sm">{tag}</div>)}
                </>
                }
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <div className="text-xl mb-4">{data.game_name} ({data?.tokenomic?.ticker})</div>
                <div className="flex w-full leading-7">
                  <div className="mr-2">Network</div>
                  <div className="flex-1 border-dotted border-b-2 border-gamefiDark-500"></div>
                  <div className="ml-2">{data?.tokenomic?.network_chain}</div>
                </div>
                <div className="flex w-full leading-7">
                  <div className="mr-2">Token Supply</div>
                  <div className="flex-1 border-dotted border-b-2 border-gamefiDark-500"></div>
                  <div className="ml-2">{(data?.tokenomic?.token_supply && printNumber(data?.tokenomic?.token_supply)) || 'N/A'}</div>
                </div>
                <div className="flex w-full leading-7">
                  <div className="mr-2">Project Valuation</div>
                  <div className="flex-1 border-dotted border-b-2 border-gamefiDark-500"></div>
                  <div className="ml-2">{(data?.tokenomic?.project_valuation && printNumber(data?.tokenomic?.project_valuation)) || 'N/A'}</div>
                </div>
                <div className="flex w-full leading-7">
                  <div className="mr-2">Initial Circulating Supply</div>
                  <div className="flex-1 border-dotted border-b-2 border-gamefiDark-500"></div>
                  <div className="ml-2">{(data?.tokenomic?.initial_token_cir && printNumber(data?.tokenomic?.initial_token_cir)) || 'N/A'}</div>
                </div>
                <div className="flex w-full leading-7">
                  <div className="mr-2">Initial Market Cap</div>
                  <div className="flex-1 border-dotted border-b-2 border-gamefiDark-500"></div>
                  <div className="ml-2">{(data?.tokenomic?.initial_token_market && printNumber(data?.tokenomic?.initial_token_market)) || 'N/A'}</div>
                </div>

                { data?.tokenomic?.token_utilities && <>
                  <div className="mt-6"><strong>How tokens are used in game</strong></div>
                  <div dangerouslySetInnerHTML={{ __html: data?.tokenomic?.token_utilities }}></div>
                </>
                }

                { data?.tokenomic?.token_economy && <>
                  <div className="mt-6"><strong>Token Economy</strong></div>
                  <div dangerouslySetInnerHTML={{ __html: data?.tokenomic?.token_economy }}></div>
                </>
                }

                { data?.tokenomic?.token_metrics && <>
                  <div className="mt-6"><strong>Token Metrics</strong></div>
                  <div dangerouslySetInnerHTML={{ __html: data?.tokenomic?.token_metrics }}></div>
                </>
                }

                { data?.tokenomic?.token_metrics && <>
                  <div className="mt-6"><strong>Token Distribution</strong></div>
                  <div dangerouslySetInnerHTML={{ __html: data?.tokenomic?.token_distribution }}></div>
                </>
                }

                { data?.tokenomic?.token_release && <>
                  <div className="mt-6"><strong>Token Release Schedule</strong></div>
                  <div dangerouslySetInnerHTML={{ __html: data?.tokenomic?.token_release }}></div>
                </>
                }
              </TabPanel>
              <TabPanel value={tab} index={2}>
                { data?.projectInformation?.roadmap.replace(/(<([^>]+)>)/gi, '') && <>
                  <div className="mt-6"><strong>Roadmap</strong></div>
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data?.projectInformation?.roadmap.replace(/(<([^>]+)>)/gi, '')} alt={data?.game_name} />
                  </div>
                </>
                }

                { data?.projectInformation?.investors && <>
                  <div className="mt-6"><strong>Partners</strong></div>
                  <div dangerouslySetInnerHTML={{ __html: data?.projectInformation?.investors }}></div>
                </>
                }

                { data?.projectInformation?.technologist && <>
                  <div className="mt-6"><strong>Technology</strong></div>
                  <div dangerouslySetInnerHTML={{ __html: data?.projectInformation?.technologist }}></div>
                </>
                }
              </TabPanel>
            </div>
          </div>
          <div className="">
            <p className="text-sm mb-2">Current Price (% Chg 24H)</p>
            <div className="inline-flex items-center mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.icon_token_link} className="w-6 h-6" alt={data.game_name} />
              <span className="ml-3 text-3xl font-mechanic font-bold">{formatPrice(data.tokenomic?.price)}</span>
              <PriceChange className="ml-3 py-1 text-xs font-medium" tokenomic={data.tokenomic} />
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-300">IGO Price</span>
              <span className="font-medium text-base">{formatPrice(data.token_price)}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-300">IGO ROI</span>
              <span className="font-medium text-base">{roi}x</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-300">Volume (24H)</span>
              <span className="font-medium text-base">{formatterUSD.format(data.tokenomic?.volume_24h)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Fully Diluted Market Cap</span>
              <span className="font-medium text-base">{formatterUSD.format(data.tokenomic?.fully_diluted_market_cap)}</span>
            </div>

            <div className="h-px bg-gradient-to-r from-gray-300 my-8"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-300">Developer</span>
              <span className="font-medium text-base truncate max-w-xs">{data.developer}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-300 flex-none">Category</span>
              <span className="font-medium text-base truncate max-w-xs">{data.category.split(',').join(', ')}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-300">Language</span>
              <span className="font-medium text-base">{data.language}</span>
            </div>

            <div className="flex items-center justify-between mb-8">
              <span className="text-sm text-gray-300">Community</span>
              <p className="inline-flex gap-6">
                { data?.projectInformation?.official_website && <a href={data?.projectInformation?.official_website} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                  <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM13.9 7H12C11.9 5.5 11.6 4.1 11.2 2.9C12.6 3.8 13.6 5.3 13.9 7ZM8 14C7.4 14 6.2 12.1 6 9H10C9.8 12.1 8.6 14 8 14ZM6 7C6.2 3.9 7.3 2 8 2C8.7 2 9.8 3.9 10 7H6ZM4.9 2.9C4.4 4.1 4.1 5.5 4 7H2.1C2.4 5.3 3.4 3.8 4.9 2.9ZM2.1 9H4C4.1 10.5 4.4 11.9 4.8 13.1C3.4 12.2 2.4 10.7 2.1 9ZM11.1 13.1C11.6 11.9 11.8 10.5 11.9 9H13.8C13.6 10.7 12.6 12.2 11.1 13.1Z" fill="currentColor"/>
                  </svg>
                </a> }

                { data?.projectInformation?.official_telegram_link && <a href={data?.projectInformation?.official_telegram_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                  <svg className="w-5 h-5" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.9683 0.684219C15.9557 0.625173 15.9276 0.570567 15.8868 0.526075C15.846 0.481584 15.794 0.44883 15.7363 0.431219C15.526 0.389298 15.3084 0.404843 15.1063 0.476219C15.1063 0.476219 1.08725 5.51422 0.286252 6.07222C0.114252 6.19322 0.056252 6.26222 0.027252 6.34422C-0.110748 6.74422 0.320252 6.91722 0.320252 6.91722L3.93325 8.09422C3.99426 8.10522 4.05701 8.10145 4.11625 8.08322C4.93825 7.56422 12.3863 2.86122 12.8163 2.70322C12.8843 2.68322 12.9343 2.70322 12.9163 2.75222C12.7443 3.35222 6.31025 9.07122 6.27525 9.10622C6.25818 9.12048 6.2448 9.13866 6.23627 9.15921C6.22774 9.17975 6.2243 9.20206 6.22625 9.22422L5.88925 12.7522C5.88925 12.7522 5.74725 13.8522 6.84525 12.7522C7.62425 11.9732 8.37225 11.3272 8.74525 11.0142C9.98725 11.8722 11.3243 12.8202 11.9013 13.3142C11.9979 13.4083 12.1125 13.4819 12.2383 13.5305C12.3641 13.5792 12.4985 13.6018 12.6333 13.5972C12.7992 13.5767 12.955 13.5062 13.0801 13.3952C13.2051 13.2841 13.2934 13.1376 13.3333 12.9752C13.3333 12.9752 15.8943 2.70022 15.9793 1.31722C15.9873 1.18222 16.0003 1.10022 16.0003 1.00022C16.0039 0.893924 15.9931 0.787623 15.9683 0.684219Z" fill="currentColor"/>
                  </svg>
                </a> }

                { data?.projectInformation?.twitter_link && <a href={data?.projectInformation?.twitter_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                  <svg className="w-5 h-5" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2C15.4 2.3 14.8 2.4 14.1 2.5C14.8 2.1 15.3 1.5 15.5 0.7C14.9 1.1 14.2 1.3 13.4 1.5C12.8 0.9 11.9 0.5 11 0.5C9.3 0.5 7.8 2 7.8 3.8C7.8 4.1 7.8 4.3 7.9 4.5C5.2 4.4 2.7 3.1 1.1 1.1C0.8 1.6 0.7 2.1 0.7 2.8C0.7 3.9 1.3 4.9 2.2 5.5C1.7 5.5 1.2 5.3 0.7 5.1C0.7 6.7 1.8 8 3.3 8.3C3 8.4 2.7 8.4 2.4 8.4C2.2 8.4 2 8.4 1.8 8.3C2.2 9.6 3.4 10.6 4.9 10.6C3.8 11.5 2.4 12 0.8 12C0.5 12 0.3 12 0 12C1.5 12.9 3.2 13.5 5 13.5C11 13.5 14.3 8.5 14.3 4.2C14.3 4.1 14.3 3.9 14.3 3.8C15 3.3 15.6 2.7 16 2Z" fill="currentColor"/>
                  </svg>
                </a> }

                { data?.projectInformation?.medium_link && <a href={data?.projectInformation?.medium_link} className="hover:text-gray-300" target="_blank" rel="noopenner noreferrer">
                  <svg className="w-5 h-5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1L0 15C0 15.2652 0.105357 15.5196 0.292893 15.7071C0.48043 15.8946 0.734784 16 1 16H15C15.2652 16 15.5196 15.8946 15.7071 15.7071C15.8946 15.5196 16 15.2652 16 15V1C16 0.734784 15.8946 0.48043 15.7071 0.292893C15.5196 0.105357 15.2652 0 15 0V0ZM13.292 3.791L12.434 4.614C12.3968 4.64114 12.3679 4.67798 12.3502 4.72048C12.3326 4.76299 12.327 4.80952 12.334 4.855V10.9C12.327 10.9455 12.3326 10.992 12.3502 11.0345C12.3679 11.077 12.3968 11.1139 12.434 11.141L13.272 11.964V12.145H9.057V11.964L9.925 11.121C10.01 11.036 10.01 11.011 10.01 10.88V5.993L7.6 12.124H7.271L4.461 5.994V10.1C4.44944 10.1854 4.45748 10.2722 4.48452 10.354C4.51155 10.4358 4.55685 10.5103 4.617 10.572L5.746 11.942V12.123H2.546V11.942L3.675 10.572C3.73466 10.5103 3.77896 10.4354 3.80433 10.3534C3.82969 10.2714 3.8354 10.1846 3.821 10.1V5.351C3.82727 5.28576 3.81804 5.21996 3.79406 5.15896C3.77008 5.09797 3.73203 5.0435 3.683 5L2.683 3.791V3.61H5.8L8.2 8.893L10.322 3.61H13.293L13.292 3.791Z" fill="currentColor"/>
                  </svg>
                </a> }
              </p>
            </div>

            <div className="font-mechanic font-bold uppercase text-center text-sm">
              <div className={`cursor-pointer clipped-t-l p-px mb-4 ${liked ? 'bg-gamefiYellow-500 text-gamefiYellow-500 hover:bg-gamefiYellow-600 hover:text-gamefiYellow-600' : 'bg-gamefiGreen-500 text-gamefiGreen-500 hover:bg-gamefiGreen-700 hover:text-gamefiGreen-700'}`} onClick={() => like(data)}>
                <div className="clipped-t-l bg-gamefiDark-900 p-4 flex justify-center items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 9.625H12.25V7.875H10.5V9.625H8.75V11.375H10.5V13.125H12.25V11.375H14V9.625Z" fill="currentColor"/>
                    <path d="M7.00003 10.7161L2.37565 6.34462C1.53828 5.48975 1.54265 4.11338 2.39053 3.2655C2.80353 2.8525 3.35303 2.625 3.93753 2.625C4.6244 2.625 5.24653 2.95575 5.52828 3.32675C5.69103 3.53675 6.8189 4.69 7.00003 4.9175C7.18115 4.69 8.30903 3.53675 8.47178 3.32675C8.75178 2.95837 9.38003 2.625 10.0625 2.625C10.647 2.625 11.1965 2.8525 11.6095 3.2655C12.3892 4.046 12.4469 5.26837 11.8003 6.125H13.762C14.252 4.739 13.9554 3.13688 12.8468 2.02825C12.0777 1.25913 11.0705 0.875 10.0625 0.875C9.05453 0.875 8.0474 1.25913 7.27828 2.02825C7.1724 2.13413 7.09103 2.25488 7.00003 2.36863C6.90903 2.25488 6.82765 2.13413 6.72178 2.02825C5.95265 1.25913 4.94553 0.875 3.93753 0.875C2.92953 0.875 1.9224 1.25913 1.15328 2.02825C-0.3841 3.56562 -0.3841 6.05938 1.15328 7.59675L7.00003 13.125V10.7161Z" fill="currentColor"/>
                  </svg>
                  { liked ? 'Remove from favourite List' : 'Add to favourite List'}
                </div>
              </div>
              { data.web_game_link && <Link href={data.web_game_link} passHref={true}><a target="_blank" rel="noopenner noreferrer" className="block cursor-pointer clipped-b-r bg-gamefiGreen-500 hover:bg-gamefiGreen-700 p-4 text-gamefiDark-900">
                Play
              </a></Link> }
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps ({ params }) {
  if (!params?.slug) {
    return { props: { data: {} } }
  }

  const data = await fetchOneWithSlug(params.slug)
  if (!data?.data) {
    return { props: { data: {} } }
  }

  return { props: { data: data.data } }
}

export default GameDetails
