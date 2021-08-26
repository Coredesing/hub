import clsx from 'clsx';
import useStyles from './style';
import Image from '../../../components/Base/Image';
import Link from '@material-ui/core/Link';

type Props = {
  card: { [k: string]: any },
  [k: string]: any
}
export const PartnerCard = ({ card, ...props }: Props) => {
  const styles = { ...useStyles() };

  return (
    <div className={clsx(styles.partnerCard, props.className)}>
      <div className="img">
        <Image src={card.banner} />
      </div>
      <div className="info">
        <h4>{card.name}</h4>
        {/* <h5>My DeFi Pet is a a virtual pet game that combines, My DeFi Pet is a a virtual pet game that combines, My DeFi Pet is a a virtual pet game that combines</h5> */}
        <Link href={card.website} target="_blank">
          Discover
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.50001 4.49999L4.50001 6.09188L10.7831 6.09185L3.93749 12.9375L5.0625 14.0625L11.9081 7.21686V13.5L13.5 13.5V4.50001L4.50001 4.49999Z" fill="#72F34B" />
          </svg>
        </Link>
      </div>
    </div>
  );
};
