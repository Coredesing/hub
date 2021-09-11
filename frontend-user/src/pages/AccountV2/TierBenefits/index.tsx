import {useSelector} from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, withWidth, Hidden } from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import { numberWithCommas } from "../../../utils/formatNumber";
import useStyles from './style';
import {TIERS, TIER_NAMES} from '../../../constants';
import { useMemo } from 'react';
function createData(name: string, rookie: number, elite: number, pro: number, master: number) {
  return { name, rookie, elite, pro, master };
}

const rows = [
  createData('Minimum stalking time required (GAFI)', 0, 0, 0, 0),
  createData('Unstaking delay (GAFI)', 0, 0, 0, 0),
  createData('Social interaction requirements', 1, 1, 0, 0),
  createData('Guaranteed allocation', 0, 1, 1, 1),
  createData('Exclusive pools', 0, 0, 1, 1),
  createData('Occasional airdrop of NFT and tokens', 0, 0, 0, 1),
  createData('Private prosperity group', 0, 0, 0, 1),
];


const rowTiersMobile = [
  {
    name: TIER_NAMES[1].toLowerCase(),
    values: [
      'Minimum amount of GameFI power required :<span>$value</span>',
      'Social interaction requirements',
    ]
  },
  {
    name: TIER_NAMES[2].toLowerCase(),
    values: [
      'Minimum amount of GameFI power required :<span>$value</span>',
      'Social interaction requirements',
      'Guaranteed allocation'
    ]
  },
  {
    name: TIER_NAMES[3].toLowerCase(),
    values: [
      'Minimum amount of GameFI power required :<span>$value</span>',
      'Guaranteed allocation',
      'Exclusive pools'
    ]
  },
  {
    name: TIER_NAMES[4].toLowerCase(),
    values: [
      'Minimum amount of GameFI power required :<span>$value</span>',
      'Guaranteed allocation',
      'Exclusive pools',
      'Occasional airdrop of NFT and tokens',
      'Private prosperity group',
    ]
  },
]

const TierBenefits = (props: any) => {
  const styles = useStyles();
  const { connectedAccount} = useAuth();
  const { data: tiers = [] } = useSelector((state: any) => state.tiers);
  const {data: rates} = useSelector((state: any) => state.rates);

  const rowCells: any[] = tiers.map((val: number, idx: any) => {
    const key: keyof typeof TIER_NAMES = (idx + 1);
    return {
      value: numberWithCommas(val),
      name: TIER_NAMES[key] || ''
    }
  })
  const rowsMobile = useMemo(() => {
    const rows = tiers.map((value: number, idx: number) => {
      rowTiersMobile[idx].values[0] = rowTiersMobile[idx].values[0].replace(/\$value/, numberWithCommas(value + ''));
      return rowTiersMobile[idx];
    });
    return rows;
  }, [tiers]);

  return (
    <div className={styles.tabTierBenefits}>
      <Hidden smDown>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableCellHead}></TableCell>
                {
                  rowCells.map((row) => <TableCell className={styles.tableCellHead} align="right">{row.name}</TableCell>)
                }
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={styles.tableRow}>
                <TableCell className={styles.tableCellBody} component="th" scope="row">
                  Minimum amount of GameFI power required
                </TableCell>
                {
                  rowCells.map((row) =>  <TableCell className={styles.tableCellBody} align="right">{row.value}</TableCell>)
                }
              </TableRow>
              {rows.map((row) => (
                <TableRow key={row.name} className={styles.tableRow}>
                  <TableCell className={styles.tableCellBody} component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell className={styles.tableCellBody} align="right">
                    <img src={`/images/account_v3/icons/icon_table_${row.rookie === 0 ? 'false' : 'true'}.svg`} alt="" />
                  </TableCell>
                  <TableCell className={styles.tableCellBody} align="right">
                    <img src={`/images/account_v3/icons/icon_table_${row.elite === 0 ? 'false' : 'true'}.svg`} alt="" />
                  </TableCell>
                  <TableCell className={styles.tableCellBody} align="right">
                    <img src={`/images/account_v3/icons/icon_table_${row.pro === 0 ? 'false' : 'true'}.svg`} alt="" />
                  </TableCell>
                  <TableCell className={styles.tableCellBody} align="right">
                    <img src={`/images/account_v3/icons/icon_table_${row.master === 0 ? 'false' : 'true'}.svg`} alt="" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Hidden>

      <Hidden mdUp>
        <div className={styles.tierBenefitsMobile}>
          {
            rowsMobile?.map((item: any, index: number) => {
              return (
                <div className={styles.itemTierMobile} key={index}>
                  <div className={styles.nameTierMobile}>{item.name}</div>
                  <ul className={styles.listActiveTierMobile}>
                    {
                      item?.values?.map((value: string, i: number)=> {
                        return (
                          <li key={i} className={styles.valueActiveMobile} >
                            <img src={`/images/account_v3/icons/icon_table_true.svg`} alt="" />
                            <div dangerouslySetInnerHTML={{__html: value}} />
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              )
            })
          }
        </div>
      </Hidden>
    </div>
  );
};

export default withWidth()(TierBenefits);
