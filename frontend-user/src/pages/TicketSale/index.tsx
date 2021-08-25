import React, { useCallback, useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import clsx from 'clsx';
import useStyles, { useCardStyles } from './style';
import { ActiveCard } from './ActiveCard';
import { UpcomingCard } from './UpcomingCard';
import DefaultLayout from '../../components/Layout/DefaultLayout'
import withWidth, { isWidthDown, isWidthUp } from '@material-ui/core/withWidth';
import { CompleteCard } from './CompleteCard';
import { useFetchV1 } from '../../hooks/useFetch';
import { TOKEN_TYPE } from '../../constants';
import { PaginationResult } from '../../types/Pagination';
import { isEmail } from '../../utils';
import axios from '../../services/axios';

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

  const [email, setEmail] = useState('');
  const [statusSubc, setStatusSub] = useState<{
    ok?: boolean,
    msg?: string,
    isShow: boolean,
  }>({
    ok: false,
    msg: '',
    isShow: false
  });
  const onChangeEmail = (event: any) => {
    const value = event.target.value;
    setEmail(value);
  }
  const onSubmitEmail = () => {
    if (!isEmail(email)) {
      return setStatusSub({ ok: false, msg: 'Invalid email', isShow: true });
    }
    axios.post('/home/subscribe', { email })
      .then((res) => {
        const result = res.data;
        if (result?.status === 200) {
          setEmail('');
          setStatusSub({ ok: true, msg: 'Subcribe succesfully. We\'ll contact to you as soos as possible!.', isShow: true });
          setTimeout(() => {
            setStatusSub({isShow: false});
          }, 4000);
        } else {
          setStatusSub({ ok: false, msg: 'Something wrong was happened. Please try again later!', isShow: true });
        }
      }).catch(err => {
        console.log(err);
        setStatusSub({ ok: false, msg: 'Something wrong was happened. Please try again later!', isShow: true });
      })
  }


  return (
    <DefaultLayout>
      <section className={clsx(styles.pools, styles.section)}>
        <div className="rectangle">
          <img src="/images/landing/rectangle.png" alt="" />
        </div>

        <div className={styles.poolItem}>
          <h3>Active Pools</h3>

          <div className={clsx(styles.cards, styles.cardsActive)}>
            {
              (activePools?.data || []).map((card, id) => <ActiveCard key={id} card={card} refresh={refresh} />)
            }

          </div>
        </div>

        <div className={styles.poolItem}>
          <h3>Upcoming</h3>

          <div className={clsx(styles.cards, styles.cardsUpcoming)}>
            {
              (upcomingPools?.data || []).map((card, id: number) => <UpcomingCard key={id} card={card} refresh={refresh} />)
            }
          </div>
        </div>
      </section>
      <section className={clsx(styles.completePools, styles.section)}>
        <div className="rectangle">
          <img src="/images/landing/rectangle-black.png" alt="" />
        </div>
        <div className={styles.poolItem}>
          <h3>Complete Sale</h3>

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
      <section className={clsx(styles.section, styles.contact)}>
        <div className="rectangle">
          <img src="/images/subcriber.svg" alt="" />
        </div>
        <h3>
          Get the Latest in Your Inbox
        </h3>
        <div className={styles.contactForm}>
          <form onSubmit={(e) => { e.preventDefault(); onSubmitEmail() }}>
            <TextField className={styles.inputForm}
              label="Email" variant="outlined"
              placeholder="Enter your Email"
              value={email}
              onChange={onChangeEmail}
              onSubmit={(e) => e.preventDefault()}
            />
            <Button className={styles.btnForm} type="submit">
              Subscribe
            </Button>
          </form>

          {statusSubc.isShow && <div className={clsx(styles.alertMsg, {
            error: !statusSubc.ok,
            success: statusSubc.ok
          }
          )}>
            {statusSubc.ok ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM15.5355 8.46447C15.9261 8.07394 16.5592 8.07394 16.9498 8.46447C17.3403 8.85499 17.3403 9.48816 16.9498 9.87868L11.2966 15.5318L11.2929 15.5355C11.1919 15.6365 11.0747 15.7114 10.9496 15.7602C10.7724 15.8292 10.5795 15.8459 10.3948 15.8101C10.2057 15.7735 10.0251 15.682 9.87868 15.5355L9.87489 15.5317L7.05028 12.7071C6.65975 12.3166 6.65975 11.6834 7.05028 11.2929C7.4408 10.9024 8.07397 10.9024 8.46449 11.2929L10.5858 13.4142L15.5355 8.46447Z" fill="#0A0A0A" />
            </svg>
              : <img src={'/images/warning-red.svg'} alt="" />}
            <span>{statusSubc.msg}</span>
          </div>}

        </div>
      </section>
    </DefaultLayout>
  );
};

export default withWidth()(withRouter(TicketSale));
