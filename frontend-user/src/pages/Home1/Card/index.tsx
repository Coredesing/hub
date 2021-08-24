/* eslint-disable @typescript-eslint/no-unused-expressions */
import clsx from 'clsx';
import {useHistory} from 'react-router-dom';
import useStyles from './style';
import { useCardStyles } from '../style';
import Image from '../../../components/Base/Image';
import { TOKEN_TYPE } from '../../../constants';

type Props = {
  card: { [k: string]: any },
  [k: string]: any
}
export const Card = ({ card, ...props }: Props) => {
  const history = useHistory();
  const styles = { ...useStyles(), ...useCardStyles() };
  const isOpen = card.campaign_status === 'Filled';
  const isTicket = card.token_type === TOKEN_TYPE.ERC721;
  return (
    <div className={clsx(styles.card, props.className, {
      [styles.cardOpening]: isOpen
    })} onClick={() => {
      if(isOpen) {
        isTicket ? history.push(`/buy-nft/${card.id}`) : history.push(`/buy-token/${card.id}`)
      }
    }}>
      <div className={clsx(styles.cardImg, styles.cardImgUpcoming)}>
        <h4>{card.campaign_status}</h4>
        <Image src={card.banner} />
      </div>
    </div>
  );
};
