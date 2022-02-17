import React, { useState } from 'react'
import { BulletListIcon, GridIcon } from '@/components/Base/Icon'
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow } from '@/components/Base/Table'
import { ObjectType } from '@/utils/types'
import SerieContentModal from './SerieContentModal'

type Props = {
  poolInfo: ObjectType;
}
const SerieContent = ({ poolInfo }: Props) => {
  const showTypes = { table: 'table', grid: 'grid' }
  const [showTypeSerieContent, setShowTypeSerieContent] = useState<typeof showTypes[keyof typeof showTypes]>(showTypes.table)
  const onSelectShowSerieContent = (type: typeof showTypes[keyof typeof showTypes]) => {
    setShowTypeSerieContent(type)
  }

  const [openSerieContentModal, setOpenSerieContentModal] = useState(true)

  const [idSerie, setIdSerie] = useState(0)
  const onShhowSerieModal = (id: number) => {
    setIdSerie(id)
    setOpenSerieContentModal(true)
  }

  const firstSerie = poolInfo.seriesContentConfig[0]
  const isShowRateSerie = firstSerie && +firstSerie.rate > 0
  const isShowAmountSerie = firstSerie && +firstSerie.amount > 0

  return <div className="relative">
    {/* <SerieContentModal
      open={openSerieContentModal}
      onClose={() => setOpenSerieContentModal(false)}
      serieContents={poolInfo.seriesContentConfig || []}
      idShow={idSerie}
    /> */}
    <div className="view-mode flex gap-5 items-center" style={{ position: 'absolute', right: '15px', top: '18px' }}>
      <span className='text-white/70 font-casual text-sm'>View</span>
      <span className="cursor-pointer">
        <BulletListIcon color={showTypeSerieContent === showTypes.table ? '#6CDB00' : '#6C6D71'} className="pointer" onClick={() => onSelectShowSerieContent(showTypes.table)} />
      </span>
      {/* <span className="cursor-pointer">
        <GridIcon color={showTypeSerieContent === showTypes.grid ? '#6CDB00' : '#6C6D71'} className="pointer" onClick={() => onSelectShowSerieContent(showTypes.grid)} />
      </span> */}
    </div>
    <div className="mb-3">
      {showTypeSerieContent === showTypes.table &&
        <Table >
          <TableHead>
            <TableRow>
              <TableCellHead>
                Name
              </TableCellHead>
              {isShowAmountSerie && <TableCellHead>
                Amount
              </TableCellHead>
              }
              {
                isShowRateSerie && <TableCellHead>
                  Rarity
                </TableCellHead>
              }

              {poolInfo.seriesContentConfig?.[0]?.description && <TableCellHead>
                Description
              </TableCellHead>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              poolInfo.seriesContentConfig.map((b, id) => <TableRow key={id}>
                <TableCell>
                  <div onClick={() => onShhowSerieModal(id)} className="flex gap-3 items-center uppercase text-sm font-semibold cursor-pointer">
                    <img src={b.icon} alt="" className="w-12 h-14" />
                    <span>{b.name}</span>
                  </div>
                </TableCell>
                {isShowAmountSerie && <TableCell>
                  {b.amount}
                </TableCell>
                }
                {isShowRateSerie && <TableCell>
                  {b.rate}
                </TableCell>
                }
                {
                  poolInfo.seriesContentConfig?.[0]?.description && <TableCell>
                    <div>
                      <span
                        className="break-words break-all text-ellipsis overflow-hidden text-sm"
                        style={{
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                        {b.description}
                      </span>
                      {/* <span
                        className="text-gamefiGreen font-casual font-semibold ml-1 cursor-pointer text-sm"
                      >
                        Read more
                      </span> */}
                    </div>
                  </TableCell>
                }
              </TableRow>)
            }
          </TableBody>
        </Table>
      }
      {
        showTypeSerieContent === showTypes.grid &&
        <div className="grid gap-2 justify-center" style={{ paddingTop: '55px', gridTemplateColumns: 'repeat(auto-fill, 260px)' }}>
          {poolInfo.seriesContentConfig.map((p, id) => (<div key={id} className=" bg-gamefiDark-400" style={{ minHeight: '500px', background: '#23252B' }}>
            <div className="w-full h-56 p-2">
              <img src={p.banner} alt="" className="w-full h-full object-contain" />
            </div>
          </div>))}
        </div>
      }
    </div>
  </div>
}

export default SerieContent
