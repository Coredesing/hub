import clsx from 'clsx';
import useStyles from './style';
import { useCardStyles } from '../style';
import Image from '../../../components/Base/Image';

type Props = {
  card: { [k: string]: any },
  [k: string]: any
}
export const Card = ({ card, ...props }: Props) => {
  const styles = { ...useStyles(), ...useCardStyles() };

  return (
    <div className={clsx(styles.card, props.className)}>
      <div className={clsx(styles.cardImg, styles.cardImgUpcoming)}>
        <h4>{card.campaign_status}</h4>
        <Image src={card.banner} />
      </div>
    </div>
  );
};
