import React from 'react'
import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '@styles/CommonStyle';
import { ObjectType } from '@app-types';
import { formatNumber } from '@utils/index';

export const useStyles = makeStyles((theme) => ({
    card: {
        cursor: 'pointer',
        background: 'radial-gradient(82.49% 167.56% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%)',
        border: '1px solid #686868',
        backdropFilter: 'blur(80px)',
        borderRadius: '4px',
        padding: '10px',
        '& .img': {
            width: '100%',
            height: '275px',
            background: '#000',
            marginBottom: '10px',
            borderRadius: '4px',
            overflow: 'hidden',
            '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'contain',
            }
        },
        '& .infor': {
            '& h3': {
                fontFamily: 'Firs Neue',
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 600,
                fontStyle: 'normal',
                color: '#fff',
                marginBottom: '12px',
            },
            '& .item': {
                ...typeDisplayFlex,
                gap: '10px',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                '&:last-child': {
                    marginBottom: 'unset',
                },
                '& .prop': {
                    color: '#AEAEAE',
                    fontSize: '12px',
                    fontWeight: 'normal',
                    fontFamily: 'Helvetica',
                    lineHeight: '12px',

                },
            },
        }
    },

}));

type Props = ObjectType<any> & {
    item: ObjectType<any>
}

const BoxCard = ({ item, ...props }: Props) => {
    const styles = useStyles();
    return (
        <div {...props} className={styles.card}>
            <div className="img">
                {item.image && <img src={item.image} alt="" />}
            </div>
            <div className="infor">
                <h3>#{formatNumber(item.id, 3)}</h3>
                <div className="item">
                    <span className="prop">Price</span>
                    <span className="value">{item.price}</span>
                </div>
                <div className="item">
                    <span className="prop">Creator</span>
                    <span className="value">{item.creator}</span>
                </div>

            </div>
        </div>
    )
}

export const getElmStr = ({ item, styles, ...props }: Props) => {
    const wrapper = document.createElement('div');
    wrapper.onclick = props.onClick;
    wrapper.classList.add(styles.card);
    const wrapperImg = document.createElement('div');
    wrapperImg.classList.add('img');
    if (item.image) {
        const img = document.createElement('img');
        img.src = item.image;
        wrapperImg.appendChild(img);
    }

    const wrapperInfor = document.createElement('div');
    
    wrapperInfor.classList.add('infor');
    const h3 = document.createElement('h3')
    h3.append(`#${formatNumber(item.id, 3)}`);
    wrapperInfor.appendChild(h3);
    const wrapperItem = document.createElement('div');
    wrapperItem.classList.add('item')
    const spanPropPrice = document.createElement('span');
    spanPropPrice.append('Price');
    spanPropPrice.classList.add('prop');
    wrapperItem.append(spanPropPrice)
    const spanValuePrice = document.createElement('span');
    spanValuePrice.append(item.price || '');
    spanValuePrice.classList.add('value');
    wrapperItem.append(spanValuePrice);
    wrapperInfor.appendChild(wrapperItem);
    const wrapperItemCreator = document.createElement('div');
    wrapperItemCreator.classList.add('item')
    const spanPropCreator = document.createElement('span');
    spanPropCreator.append('Creator');
    spanPropCreator.classList.add('prop');
    wrapperItemCreator.append(spanPropCreator)
    const spanValueCreator = document.createElement('span');
    spanValueCreator.append(item.creator || '');
    spanValueCreator.classList.add('value');
    wrapperItemCreator.append(spanValueCreator);
    wrapperInfor.appendChild(wrapperItemCreator);
    wrapper.appendChild(wrapperImg);
    wrapper.appendChild(wrapperInfor);
    return wrapper;
    //     return `
    //     <div  className="${styles.card}">
    //     <div className="img">
    //         <img src="${item.image}"" alt="" />
    //     </div>
    //     <div className="infor">
    //         <h3>#${formatNumber(item.id, 3)}</h3>
    //         <div className="item">
    //             <span className="prop">Price</span>
    //             <span className="value">${item.price}</span>
    //         </div>
    //         <div className="item">
    //             <span className="prop">Creator</span>
    //             <span className="value">${item.creator}</span>
    //         </div>
    //     </div>
    // </div>
    //     `
}

export default BoxCard
