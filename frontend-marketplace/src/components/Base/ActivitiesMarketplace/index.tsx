import { ActionSaleNFT } from '@app-constants';
import { Pagination } from '@base-components/Pagination';
import {
    TableBody,
    TableContainer,
    Table,
    TableHead,
    TableCell,
    TableRowBody,
    TableRowHead,
} from '@base-components/Table';
import { Box, Link as MuiLink } from '@material-ui/core';
import { cvtAddressToStar, formatHumanReadableTime } from '@utils/';
import { getExplorerTransactionLink, getNetworkInfo } from '@utils/network';
type Props = {
    data: any[];
    totalPage?: number;
    currentPage?: number;
    onChangePage?: Function;
    [k: string]: any;
}
const ActivitiesMarketplace = ({ data = [], ...props }: Props) => {
    return (
        <>
            <TableContainer style={{ borderBottom: '1px solid #44454B' }} >
                <Table style={{
                    background: "radial-gradient(82.49% 167.56% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%)"
                }}>
                    <TableHead>
                        <TableRowHead>
                            <TableCell>ITEM</TableCell>
                            <TableCell>PRICE</TableCell>
                            <TableCell>TYPE</TableCell>
                            <TableCell>FROM</TableCell>
                            <TableCell>TO</TableCell>
                            <TableCell>DATE</TableCell>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((item: any, idx: number) => <TableRowBody key={idx}>
                                <TableCell>
                                    <Box display="grid" gridTemplateColumns="56px auto" gridGap="8px" alignItems="center">
                                        <Box width="56px" height="56px" style={{ backgroundColor: "#000", borderRadius: '4px' }}>
                                            {item.image && <img src={item.image} alt="" width="56px" height="56px" />}
                                        </Box>
                                        <Box>
                                            <h4 className="firs-neue-font font-16px text-white">#{item.token_id}</h4>
                                            <span className="text-grey helvetica-font font-14px">{item?.project?.name}</span>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        <span>{item.value} {item.currencySymbol}</span>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {ActionSaleNFT[item.event_type as keyof typeof ActionSaleNFT]}
                                </TableCell>
                                <TableCell>
                                    {
                                        ActionSaleNFT[item.event_type as keyof typeof ActionSaleNFT] === ActionSaleNFT.TokenListed ||
                                            ActionSaleNFT[item.event_type as keyof typeof ActionSaleNFT] === ActionSaleNFT.TokenDelisted ?
                                            cvtAddressToStar(item.seller || '', '.', 5) :
                                            cvtAddressToStar(item.buyer || '', '.', 5)
                                    }
                                </TableCell>
                                <TableCell>
                                    {
                                        ActionSaleNFT[item.event_type as keyof typeof ActionSaleNFT] === ActionSaleNFT.TokenListed ||
                                            ActionSaleNFT[item.event_type as keyof typeof ActionSaleNFT] === ActionSaleNFT.TokenDelisted ?
                                            cvtAddressToStar(item.buyer || '', '.', 5) :
                                            cvtAddressToStar(item.seller || '', '.', 5)
                                    }
                                </TableCell>
                                <TableCell>
                                    <MuiLink
                                        className="text-white-imp flex items-center gap-4px"
                                        target="_blank"
                                        href={`${getExplorerTransactionLink({ appChainID: getNetworkInfo(item.network).id, transactionHash: item.transaction_hash })}`}>
                                        {item.dispatch_at && formatHumanReadableTime(+item.dispatch_at * 1000, Date.now())}
                                        <img src="/images/icons/square-arrow.svg" alt="" />
                                    </MuiLink>
                                </TableCell>
                            </TableRowBody>)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {!!props.totalPage &&
                <Pagination
                    count={props.totalPage}
                    page={props.currentPage}
                    onChange={(e: any, page: any) => {
                        props.onChangePage && props.onChangePage(page)
                    }}
                />
            }
        </>
    )
}

export default ActivitiesMarketplace
