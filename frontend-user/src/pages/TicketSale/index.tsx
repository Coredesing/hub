import React, { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import useStyles, { useCardStyles } from './style';
import { ActiveCard } from './ActiveCard';
import { UpcomingCard } from './UpcomingCard';
import DefaultLayout from '../../components/Layout/DefaultLayout'
import withWidth from '@material-ui/core/withWidth';
import { CompleteCard } from './CompleteCard';
import { useFetchV1 } from '../../hooks/useFetch';
import { TOKEN_TYPE } from '../../constants';
import { PaginationResult } from '../../types/Pagination';
import ContactForm from '../../components/Base/ContactForm';

const TicketSale = (props: any) => {
  const styles = { ...useStyles(), ...useCardStyles() };
  const [recall, setRecall] = useState(true);
  const refresh = useCallback(() => {
    setRecall(true);
  }, [setRecall]);
  const {
    data: activePools = {} as PaginationResult,
    loading: loadingActivePools
  } = useFetchV1(`/pools/active-pools?token_type=${TOKEN_TYPE.ERC721}&limit=10&page=1`, recall);
  const {
    data: upcomingPools = {} as PaginationResult,
    loading: loadingUpcomingPools
  } = useFetchV1(`/pools/upcoming-pools?token_type=${TOKEN_TYPE.ERC721}&limit=10&page=1`, recall);
  const {
    data: compeltePools = {} as PaginationResult,
    loading: loadingcompletePools
  } = useFetchV1(`/pools/complete-sale-pools?token_type=${TOKEN_TYPE.ERC721}&limit=10&page=1`, recall);

  useEffect(() => {
    if (!loadingActivePools && !loadingUpcomingPools && !loadingcompletePools) {
      setRecall(false);
    }
  }, [loadingActivePools, loadingUpcomingPools, loadingcompletePools]);

  return (
    <DefaultLayout>
      <section className={clsx(styles.pools, styles.section)}>
        <div className="rectangle">
          <img src="/images/landing/rectangle.png" alt="" />
        </div>
        {
          !!(activePools?.data || []).length && <div className={styles.poolItem}>
            <h3>Opening Pools</h3>

            <div className={clsx(styles.cards, styles.cardsActive)}>
              {
                (activePools?.data || []).map((card, id) => <ActiveCard key={id} card={card} refresh={refresh} />)
              }

            </div>
          </div>
        }

        {
          !!(upcomingPools?.data || []).length && <div className={styles.poolItem}>
            <h3>Upcoming</h3>

            <div className={clsx(styles.cards, styles.cardsUpcoming)}>
              {
                (upcomingPools?.data || []).map((card, id: number) => <UpcomingCard key={id} card={card} refresh={refresh} />)
              }
            </div>
          </div>
        }

      </section>
      {
        !!(compeltePools?.data || []).length && <section className={clsx(styles.completePools, styles.section)}>
          <div className="rectangle">
            <img src="/images/landing/rectangle-black.png" alt="" />
          </div>
          <div className={styles.poolItem}>
            <h3>Finished</h3>

            <div className={clsx(styles.cards, styles.completeCards)}>
              {
                (compeltePools?.data || []).map((card, id) => <CompleteCard key={id} card={card} />)
              }
            </div>
            {/* <div className={styles.cardsActions}>
            <Link href={'transactionLink'} className={styles.btnView}>
              View all pools
            </Link>
          </div> */}
          </div>
        </section>
      }
      <ContactForm className={styles.section} />
    </DefaultLayout>
  );
};

export default withWidth()(withRouter(TicketSale));
