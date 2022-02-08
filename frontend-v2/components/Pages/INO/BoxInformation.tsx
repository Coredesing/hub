import React from 'react'
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow } from '@/components/Base/Table'

type Props = {
  boxes: any[];
}

const BoxInformation = ({ boxes }: Props) => {
  return <div>
    <Table >
      <TableHead>
        <TableRow>
          <TableCellHead>
            Name
          </TableCellHead>
          <TableCellHead>
            Description
          </TableCellHead>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          boxes.map((b, id) => <TableRow key={id}>
            <TableCell>
              <div className="flex gap-3 items-center text-sm font-semibold">
                <img src={b.icon} alt="" className="w-14 h-12 object-contain" />
                <span>{b.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <span
                  className="break-words break-all text-ellipsis overflow-hidden text-sm"
                  style={{
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                  {b.description}
                </span>
                <span
                  className="text-gamefiGreen font-casual font-semibold ml-1 cursor-pointer text-sm"
                >
                  Read more
                </span>
              </div>
            </TableCell>
          </TableRow>)
        }
      </TableBody>
    </Table>
  </div>
}

export default BoxInformation
