import {useSelector} from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, withWidth, Hidden } from '@material-ui/core';
import useAuth from '../../../hooks/useAuth';
import { numberWithCommas } from "../../../utils/formatNumber";
import useStyles from './style';

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

const rowsMobile = [
  {
    name: 'ROOKIE',
    values: [
      'Minimum amount of GameFI power required :<span>500</span>',
      'Social interaction requirements',
    ]
  },
  {
    name: 'ELITE',
    values: [
      'Minimum amount of GameFI power required :<span>5,000</span>',
      'Social interaction requirements',
      'Guaranteed allocation'
    ]
  },
  {
    name: 'PRO',
    values: [
      'Minimum amount of GameFI power required :<span>20,000</span>',
      'Guaranteed allocation',
      'Exclusive pools'
    ]
  },
  {
    name: 'MASTER',
    values: [
      'Minimum amount of GameFI power required :<span>60,000</span>',
      'Guaranteed allocation',
      'Exclusive pools',
      'Occasional airdrop of NFT and tokens',
      'Private prosperity group',
    ]
  },
];

const TierBenefits = (props: any) => {
  const styles = useStyles();
  const { connectedAccount} = useAuth();

  const {data: rates} = useSelector((state: any) => state.rates);

  return (
    <div className={styles.tabTierBenefits}>
      <Hidden smDown>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className={styles.tableCellHead}></TableCell>
                <TableCell className={styles.tableCellHead} align="right">Rookie</TableCell>
                <TableCell className={styles.tableCellHead} align="right">Elite</TableCell>
                <TableCell className={styles.tableCellHead} align="right">Pro</TableCell>
                <TableCell className={styles.tableCellHead} align="right">Master</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow className={styles.tableRow}>
                <TableCell className={styles.tableCellBody} component="th" scope="row">
                  Minimum amount of GameFI power required
                </TableCell>
                <TableCell className={styles.tableCellBody} align="right">{numberWithCommas('500')}</TableCell>
                <TableCell className={styles.tableCellBody} align="right">{numberWithCommas('5000')}</TableCell>
                <TableCell className={styles.tableCellBody} align="right">{numberWithCommas('20000')}</TableCell>
                <TableCell className={styles.tableCellBody} align="right">{numberWithCommas('60000')}</TableCell>
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
            rowsMobile?.map((item, index) => {
              return (
                <div className={styles.itemTierMobile} key={index}>
                  <div className={styles.nameTierMobile}>{item.name}</div>
                  <ul className={styles.listActiveTierMobile}>
                    {
                      item?.values?.map((value, i)=> {
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
