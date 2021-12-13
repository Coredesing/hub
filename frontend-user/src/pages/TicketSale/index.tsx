import React, { useCallback, useEffect, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import clsx from 'clsx';
import useStyles, { useCardStyles } from './style';
import { ActiveCard } from './ActiveCard';
import { UpcomingCard } from './UpcomingCard';
import DefaultLayout from '../../components/Layout/DefaultLayout'
import withWidth from '@material-ui/core/withWidth';
import { CompleteCard } from './CompleteCard';
import { useFetchV1 } from '../../hooks/useFetch';
import { PaginationResult } from '../../types/Pagination';
import ContactForm from '../../components/Base/ContactForm';
import NotFoundPage from '../NotFoundPage';
import { Backdrop, CircularProgress, Link, useTheme } from '@material-ui/core';
import { getFilterTokenType, getRoute } from './utils';
import { ACCEPT_ROUTES } from './ contants';
import { ObjectType } from '@app-types';

const TicketSale = (props: any) => {
  const theme = useTheme();
  const styles = { ...useStyles(), ...useCardStyles() };
  const [recall, setRecall] = useState(false);
  const refresh = useCallback(() => {
    setRecall(true);
  }, [setRecall]);
  const params = useParams<{ [k: string]: any }>();
  const [checkParamType, setCheckParamType] = useState({
    checking: true,
    valid: false,
  });
  useEffect(() => {
    setCheckParamType({
      checking: false,
      valid: Object.values(ACCEPT_ROUTES).includes(params.type),
    });
    setRecall(true);
  }, [params]);
  const tokenType = getFilterTokenType(params.type);

  const {
    data: activePools = {} as PaginationResult,
    loading: loadingActivePools
  } = useFetchV1(`/pools/active-pools?token_type=${tokenType}&limit=20&page=1`, recall && checkParamType.valid);
  const {
    data: upcomingPools = {} as PaginationResult,
    loading: loadingUpcomingPools
  } = useFetchV1(`/pools/upcoming-pools?token_type=${tokenType}&limit=20&page=1`, recall && checkParamType.valid);
  const {
    data: compeltePools = {} as PaginationResult,
    loading: loadingcompletePools
  } = useFetchV1(`/pools/complete-sale-pools?token_type=${tokenType}&limit=10&page=1`, recall && checkParamType.valid);

  useEffect(() => {
    if (!loadingActivePools && !loadingUpcomingPools && !loadingcompletePools) {
      setRecall(false);
    }
  }, [loadingActivePools, loadingUpcomingPools, loadingcompletePools]);

  const [upcomingPoolsList, setUpcomingPoolsList] = useState<ObjectType<any>[]>([]);

  useEffect(() => {
    if (upcomingPools.data?.length) {
      const sorted = upcomingPools.data.sort((a) => a.campaign_status === 'TBA' ? 1 : -1);
      setUpcomingPoolsList(sorted);
    }
  }, [upcomingPools])

  return (
    checkParamType.checking ?
      <Backdrop open={checkParamType.checking} style={{ color: '#fff', zIndex: theme.zIndex.drawer + 1, }}>
        <CircularProgress color="inherit" />
      </Backdrop> : (
        checkParamType.valid ? <DefaultLayout>
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
                    upcomingPoolsList.map((card, id: number) => <UpcomingCard key={id} card={card} refresh={refresh} />)
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
                    (compeltePools?.data.slice(0, 5) || []).map((card, id) => <Link className={styles.noUnderline} key={id} href={`/#/${getRoute(card?.token_type)}/${card.id}`}>
                      <CompleteCard key={id} card={card} />
                    </Link>)
                  }
                </div>
                <div className={styles.cardsActions}>
                  <Link href={'/#/pools'} className={styles.btnView}>
                    View all pools
                  </Link>
                </div>
              </div>
            </section>
          }
          <ContactForm className={styles.section} />
        </DefaultLayout>
          : <NotFoundPage />
      )

  );
};

export default withWidth()(withRouter(TicketSale));
