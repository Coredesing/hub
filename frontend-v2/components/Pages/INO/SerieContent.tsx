import React, { useMemo, useState } from 'react'
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow } from '@/components/Base/Table'
import { ObjectType } from '@/utils/types'
import SerieContentModal from './SerieContentModal'

type Props = {
  poolInfo: ObjectType;
  selected?: ObjectType;
}

const rankMapping = {
  common: {
    value: 0,
    style: 'text-white'
  },
  uncommon: {
    value: 1,
    style: 'bg-gradient-to-r from-cyan-400 to-sky-500 text-transparent bg-clip-text'
  },
  rare: {
    value: 2,
    style: 'bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text'
  },
  sr: {
    value: 3,
    style: 'bg-gradient-to-r from-violet-400 to-fuchsia-500 text-transparent bg-clip-text'
  },
  ssr: {
    value: 4,
    style: 'bg-gradient-to-r from-fuchsia-400 to-pink-500 text-transparent bg-clip-text'
  },
  ur: {
    value: 5,
    style: 'bg-gradient-to-r from-red-400 to-orange-500 text-transparent bg-clip-text'
  },
  epic: {
    value: 5,
    style: 'bg-gradient-to-r from-red-400 to-orange-500 text-transparent bg-clip-text'
  },
  mythical: {
    value: 6,
    style: 'bg-gradient-to-r from-pink-500 to-red-600 text-transparent bg-clip-text'
  },
  legendary: {
    value: 7,
    style: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-transparent bg-clip-text'
  }
}

const SerieContent = ({ poolInfo, selected }: Props) => {
  const [openSerieContentModal, setOpenSerieContentModal] = useState(false)
  const [idSerie, setIdSerie] = useState(0)
  const onShowSerieModal = (id: number) => {
    setIdSerie(id)
    setOpenSerieContentModal(true)
  }
  const showTypes = { table: 'table', grid: 'grid' }
  const [showTypeSerieContent] = useState<typeof showTypes[keyof typeof showTypes]>(showTypes.table)
  const firstSerie = poolInfo?.seriesContentConfig?.[0]
  const showRate = firstSerie && parseFloat(firstSerie?.rate) > 0
  const showAmount = firstSerie && parseFloat(firstSerie?.amount) > 0
  const re = useMemo(() => /((\w+):([^|]*))+/g, [])
  const reName = useMemo(() => /^(.*?)-(.*?)(-(.*?))*$/g, [])
  const useNewFormat = firstSerie?.description.match(re)
  const useNewNameFormat = firstSerie?.name.match(reName)
  const useOldFormatWithDescription = firstSerie?.description && !useNewFormat
  const configs = useMemo(() => {
    return poolInfo?.seriesContentConfig.map(x => {
      if (useNewNameFormat) {
        const matches = x.name.matchAll(reName)
        for (const match of matches) {
          x.name = match[1].trim()
          x.rarity = match[2].trim()
          x.rarityMapping = rankMapping[(x.rarity || '').toLowerCase()]
          if (match[4]) {
            x.category = match[4].trim()
          }
        }
      }

      if (!useNewFormat) {
        return x
      }

      const metadata = {
        raw: x.description
      }

      const matches = x.description.matchAll(re)
      for (const match of matches) {
        const chanceAndAmount = match[3].match(/(.*?)%[\s,]*(.*?)items/)
        if (chanceAndAmount) {
          metadata[match[2]] = {
            probability: parseFloat(chanceAndAmount[1]),
            amount: parseFloat(chanceAndAmount[2])
          }
        }
      }

      return {
        metadata,
        ...x
      }
    }).sort((a, b) => {
      const r1 = a.rarityMapping?.value || 0
      const r2 = b.rarityMapping?.value || 0
      return r2 - r1
    })
  }, [re, reName, useNewFormat, useNewNameFormat, poolInfo])
  const useNewFormatExtended = configs?.[0]?.metadata?.[selected?.name]?.probability
  const showNewAmount = configs?.[0]?.metadata?.[selected?.name]?.amount
  const showNewRarity = configs?.[0]?.rarity
  const showNewCategory = configs?.[0]?.category

  return <div className="relative">
    <SerieContentModal
      open={openSerieContentModal}
      onClose={() => setOpenSerieContentModal(false)}
      serieContents={configs || []}
      idShow={idSerie}
    />
    <div className="view-mode flex gap-5 items-center" style={{ position: 'absolute', right: '15px', top: '18px' }}>
      {/* <span className='text-white/70 font-casual text-sm'>View</span> */}
      {/* <span className="cursor-pointer">
        <BulletListIcon color={showTypeSerieContent === showTypes.table ? '#6CDB00' : '#6C6D71'} className="pointer" onClick={() => onSelectShowSerieContent(showTypes.table)} />
      </span> */}
      {/* <span className="cursor-pointer">
        <GridIcon color={showTypeSerieContent === showTypes.grid ? '#6CDB00' : '#6C6D71'} className="pointer" onClick={() => onSelectShowSerieContent(showTypes.grid)} />
      </span> */}
    </div>
    <div className="mb-3">
      {showTypeSerieContent === showTypes.table &&
        <Table >
          <TableHead>
            <TableRow>
              <TableCellHead className="text-[12px] sm:text-[13px] md:text-sm">Name</TableCellHead>
              {showAmount && <TableCellHead className="text-[12px] sm:text-[13px] md:text-sm">Amount</TableCellHead>}
              {showRate && <TableCellHead className="text-[12px] sm:text-[13px] md:text-sm">Chance</TableCellHead>}
              {showNewCategory ? <TableCellHead className="hidden md:table-cell text-[12px] sm:text-[13px] md:text-sm">Category</TableCellHead> : null}
              {showNewRarity ? <TableCellHead className="hidden sm:table-cell text-[12px] sm:text-[13px] md:text-sm">Rarity</TableCellHead> : null}
              {useNewFormatExtended ? <TableCellHead className="text-[12px] sm:text-[13px] md:text-sm"><span className="sm:hidden">%</span><span className="hidden sm:inline">Probability</span></TableCellHead> : null}
              {showNewAmount ? <TableCellHead className="hidden md:table-cell text-[12px] sm:text-[13px] md:text-sm">Amount</TableCellHead> : null}
              {useNewFormat && !useNewFormatExtended ? <TableCellHead className="text-[12px] sm:text-[13px] md:text-sm">Description</TableCellHead> : null}
              {useOldFormatWithDescription ? <TableCellHead className="text-[12px] sm:text-[13px] md:text-sm">Description</TableCellHead> : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              configs.map((b, id) => <TableRow key={id}>
                <TableCell>
                  <div onClick={() => onShowSerieModal(id)} className="flex gap-3 items-center uppercase text-sm font-semibold cursor-pointer w-fit" style={{ minWidth: '140px' }}>
                    <div className="flex gap-3 items-center uppercase text-[12px] sm:text-sm font-semibold cursor-pointer">
                      <img src={b.icon} alt="" className="w-12 h-14" />
                      <div>
                        <span>{b.name}</span>
                        {showNewRarity ? <div className="sm:hidden">{b.rarity && <span className={`font-semibold uppercase leading-loose ml-auto ${b.rarityMapping?.style || ''}`}>{b.rarity}</span>}</div> : null}
                        {showNewCategory ? <div className="sm:hidden text-[11px] opacity-75 capitalize">{b.category}</div> : null}
                      </div>
                    </div>
                  </div>
                </TableCell>
                {showAmount && <TableCell>{b.amount}</TableCell>}
                {showRate && <TableCell>{b.rate}%</TableCell>}
                {showNewCategory ? <TableCell className="hidden md:table-cell text-[12px] sm:text-[13px] md:text-base capitalize">{b.category}</TableCell> : null}
                {showNewRarity ? <TableCell className="hidden sm:table-cell">{b.rarity && <span className={`font-semibold uppercase leading-loose ml-auto ${b.rarityMapping?.style || ''}`}>{b.rarity}</span>}</TableCell> : null}
                {useNewFormatExtended ? <TableCell className="text-[12px] sm:text-sm"> {b.metadata?.[selected?.name]?.probability ? `${b.metadata?.[selected?.name]?.probability}%` : ''} </TableCell> : null}
                {showNewAmount ? <TableCell className="hidden md:table-cell text-[12px] sm:text-[13px] md:text-base"> {b.metadata?.[selected?.name]?.amount || ''} </TableCell> : null}
                {useNewFormat && !useNewFormatExtended ? <TableCell>{b.metadata?.raw}</TableCell> : null}
                {useOldFormatWithDescription
                  ? <TableCell>
                    <div style={{ maxWidth: '500px' }}>
                      <span
                        className="break-words text-ellipsis overflow-hidden text-sm"
                        style={{
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                        {(b.description || '').slice(0, 100)}{(b.description || '').length > 100 && '...'}
                      </span>
                      {
                        (b.description || '').length > 100 && <span
                          onClick={() => onShowSerieModal(id)}
                          className="text-gamefiGreen font-casual font-semibold ml-1 cursor-pointer text-sm"
                        >
                          Read more
                        </span>
                      }
                    </div>
                  </TableCell>
                  : null}
              </TableRow>)
            }
          </TableBody>
        </Table>
      }
    </div>
  </div>
}

export default SerieContent
