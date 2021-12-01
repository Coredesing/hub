import useStyles from './style';
import { ObjectType } from '@app-types'
type Props = ObjectType<any> & {
    item: ObjectType<any>;
}
const CollectionCard = ({ item, ...props }: Props) => {
    const classes = useStyles();
    return (
        <div className={classes.collection}>
            <div className="img">
                {item.image && <img src={item.image} alt="" onError={(e: any) => {
                    e.target.style.visibility = 'hidden'
                }} />}
                {item.logo && <img src={item.logo} className="icon" alt="" />}
            </div>
            <div className="infor">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
            </div>
        </div>
    )
}

export default CollectionCard
