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
import { Backdrop, Box, CircularProgress, Link, useTheme } from '@material-ui/core';
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
    data: upcomingPublicPools = {} as PaginationResult,
    loading: loadingUpcomingPublicPools
  } = useFetchV1(`/pools/upcoming-pools?token_type=${tokenType}&limit=20&page=1&is_private=0`, recall && checkParamType.valid);

  const {
    data: upcomingPrivatePools = {} as PaginationResult,
    loading: loadingUpcomingPrivatePools
  } = useFetchV1(`/pools/upcoming-pools?token_type=${tokenType}&limit=20&page=1&is_private=1`, recall && checkParamType.valid);

  const {
    data: upcomingSeedPools = {} as PaginationResult,
    loading: loadingUpcomingSeedPools
  } = useFetchV1(`/pools/upcoming-pools?token_type=${tokenType}&limit=20&page=1&is_private=2`, recall && checkParamType.valid);

  const {
    data: upcomingCommunityPools = {} as PaginationResult,
    loading: loadingUpcomingCommunityPools
  } = useFetchV1(`/pools/upcoming-pools?token_type=${tokenType}&limit=20&page=1&is_private=3`, recall && checkParamType.valid);
  const {
    data: compeltePools = {} as PaginationResult,
    loading: loadingcompletePools
  } = useFetchV1(`/pools/complete-sale-pools?token_type=${tokenType}&limit=10&page=1`, recall && checkParamType.valid);

  useEffect(() => {
    if (!loadingActivePools && !loadingUpcomingPublicPools && !loadingcompletePools && !loadingUpcomingCommunityPools && !loadingUpcomingPrivatePools && !loadingUpcomingSeedPools) {
      setRecall(false);
    }
  }, [loadingActivePools, loadingUpcomingPublicPools, loadingcompletePools, loadingUpcomingCommunityPools, loadingUpcomingPrivatePools, loadingUpcomingSeedPools]);

  const [upcomingPublicPoolsList, setUpcomingPublicPoolsList] = useState<ObjectType<any>[]>([]);
  const [upcomingComPoolsList, setUpcomingComPoolsList] = useState<ObjectType<any>[]>([]);
  const [upcomingPrivatePoolsList, setUpcomingPrivatePoolsList] = useState<ObjectType<any>[]>([]);
  const [upcomingSeedPoolsList, setUpcomingSeedPoolsList] = useState<ObjectType<any>[]>([]);

  useEffect(() => {
    if (upcomingPublicPools.data?.length) {
      const sorted = upcomingPublicPools.data.sort((a) => a.campaign_status === 'TBA' ? 1 : -1);
      setUpcomingPublicPoolsList(sorted);
    }
  }, [upcomingPublicPools])

  useEffect(() => {
    if (upcomingCommunityPools.data?.length) {
      const sorted = upcomingCommunityPools.data.sort((a) => a.campaign_status === 'TBA' ? 1 : -1);
      setUpcomingComPoolsList(sorted);
    }
  }, [upcomingCommunityPools])

  useEffect(() => {
    if (upcomingPrivatePools.data?.length) {
      const sorted = upcomingPrivatePools.data.sort((a) => a.campaign_status === 'TBA' ? 1 : -1);
      setUpcomingPrivatePoolsList(sorted);
    }
  }, [upcomingPrivatePools])

  useEffect(() => {
    if (upcomingSeedPools.data?.length) {
      const sorted = upcomingSeedPools.data.sort((a) => a.campaign_status === 'TBA' ? 1 : -1);
      setUpcomingSeedPoolsList(sorted);
    }
  }, [upcomingSeedPools])

  useEffect(() => {
    if (upcomingCommunityPools.data?.length) {
      const sorted = upcomingCommunityPools.data.sort((a) => a.campaign_status === 'TBA' ? 1 : -1);
      setUpcomingComPoolsList(sorted);
    }
  }, [upcomingCommunityPools])

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
              (!!(upcomingPublicPools?.data || []).length || !!(upcomingCommunityPools?.data || []).length) &&
              <div className={styles.poolItem}>
                <h3>Upcoming</h3>
                <Box display="grid" gridGap="80px" gridTemplateColumns="1fr">
                {
                    !!upcomingSeedPoolsList.length && <Box width="100%" maxWidth="1140px" paddingLeft="10px" paddingRight="10px" margin="auto">
                      <div className={styles.subTitle}>
                        <span></span>
                        <h4 className="text-uppercase firs-neue-font font-20px text-white text-center font-weight-normal">Pool Seed</h4>
                        <span></span>
                      </div>
                      <div className={clsx(styles.cards, styles.cardsUpcoming)}>
                        {
                          upcomingSeedPoolsList.map((card, id: number) => <UpcomingCard key={id} card={card} refresh={refresh} />)
                        }
                      </div>
                    </Box>
                  }
                  {
                    !!upcomingPrivatePoolsList.length && <Box width="100%" maxWidth="1140px" paddingLeft="10px" paddingRight="10px" margin="auto">
                      <div className={styles.subTitle}>
                        <span></span>
                        <h4 className="text-uppercase firs-neue-font font-20px text-white text-center font-weight-normal">Pool Private</h4>
                        <span></span>
                      </div>
                      <div className={clsx(styles.cards, styles.cardsUpcoming)}>
                        {
                          upcomingPrivatePoolsList.map((card, id: number) => <UpcomingCard key={id} card={card} refresh={refresh} />)
                        }
                      </div>
                    </Box>
                  }
                  {
                    !!upcomingPublicPoolsList.length && <Box width="100%" maxWidth="1140px" paddingLeft="10px" paddingRight="10px" margin="auto">
                      <div className={styles.subTitle}>
                        <span></span>
                        <h4 className="text-uppercase firs-neue-font font-20px text-white text-center font-weight-normal">Pool IGO</h4>
                        <span></span>
                      </div>
                      <div className={clsx(styles.cards, styles.cardsUpcoming)}>
                        {
                          upcomingPublicPoolsList.map((card, id: number) => <UpcomingCard key={id} card={card} refresh={refresh} />)
                        }
                      </div>
                    </Box>
                  }
                  {
                    !!upcomingComPoolsList.length && <Box width="100%" margin="auto" maxWidth="1140px" paddingLeft="10px" paddingRight="10px">
                      <div className={styles.subTitle}>
                        <span></span>
                        <h4 className="text-uppercase firs-neue-font font-20px text-white text-center font-weight-normal">Pool Community</h4>
                        <span></span>
                      </div>
                      <div className={clsx(styles.cards, styles.cardsUpcoming)}>
                        {
                          upcomingComPoolsList.map((card, id: number) => <UpcomingCard key={id} card={card} refresh={refresh} />)
                        }
                      </div>
                    </Box>
                  }
                </Box>
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
