import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow } from '@/components/Base/Table'
import BoxesInformationModal from './BoxesInformationModal'
import { useMediaQuery } from 'react-responsive'

type Props = {
  boxes: any[];
}

const BoxInformation = ({ boxes }: Props) => {
  const [idSelected, setIdSelected] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const onShowBoxModal = (id: number) => {
    setIdSelected(id)
    setOpenModal(true)
  }

  const isSmScreen = useMediaQuery({ maxWidth: '640px' })
  const sliceTo = isSmScreen ? 30 : 100

  return <div>
    <BoxesInformationModal
      items={boxes}
      open={openModal}
      idShow={idSelected}
      onClose={() => setOpenModal(false)}
    />
    <Table >
      <TableHead>
        <TableRow>
          <TableCellHead>
            <span className='text-sm'>Name</span>
          </TableCellHead>
          <TableCellHead>
            <span className='text-sm'>Total Sale</span>
          </TableCellHead>
          <TableCellHead>
            <span className='text-sm'>Remaining</span>
          </TableCellHead>
          {
            boxes?.[0]?.description && <TableCellHead>
              <span className='text-sm'>Description</span>
            </TableCellHead>
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {
          boxes.map((b, id) => <TableRow key={id}>
            <TableCell>
              <div className="flex gap-3 items-center text-sm font-semibold w-fit cursor-pointer" style={{ minWidth: '140px' }} onClick={() => onShowBoxModal(id)}>
                <img src={b.icon} alt="" className="w-14 h-12 object-contain" />
                <span>{b.name}</span>
              </div>
            </TableCell>
            <TableCell>
              {b.maxSupply || b.limit}
            </TableCell>
            <TableCell>
              {(+(b.maxSupply || b.limit) - (+b.totalSold || 0)) ?? (b.maxSupply || b.limit)}
            </TableCell>
            {
              boxes?.[0]?.description && <TableCell>
                <div style={{ maxWidth: '500px' }}>
                  <span
                    className="break-words text-ellipsis overflow-hidden text-sm"
                    style={{
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                    {(b.description || '').slice(0, sliceTo)}{(b.description || '').length > sliceTo && '...'}
                  </span>
                  {
                    (b.description || '').length > sliceTo && <span
                      onClick={() => onShowBoxModal(id)}
                      className="text-gamefiGreen font-casual font-semibold ml-1 cursor-pointer text-sm"
                    >
                      Read more
                    </span>
                  }
                </div>
              </TableCell>
            }
          </TableRow>)
        }
      </TableBody>
    </Table>
  </div>
}

export default BoxInformation
