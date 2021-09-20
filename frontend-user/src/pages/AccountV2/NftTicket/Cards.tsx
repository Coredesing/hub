import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import useStyles, { useCardStyles } from './style';
import { useTabStyles } from '../style';
import './style.css';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import axios from '@services/axios';

const questionImg = '/images/question.png';
const ethIcon = '/images/icons/eth.svg';
const characterImg = '/images/character.png';
const guardImg = '/images/guard.png';

const Cards = (props: any) => {
    const { classNamePrefix = '' } = props;
    const styles = { ...useStyles(), ...useCardStyles(), ...useTabStyles() };
    // const [cards, setCards] = useState<{ [k in string]: any }[]>([
    //     { img: characterImg, id: '#123456', price: '0.15 ETH', isShow: true, },
    //     { img: characterImg, id: '#123456', price: '0.15 ETH', isShow: false, },
    //     { img: characterImg, id: '#123456', price: '0.15 ETH', isShow: false, },
    //     { img: characterImg, id: '#123456', price: '0.15 ETH', isShow: false, },
    // ]);
    const { data: userInfo } = useSelector((state: any) => state.userInfo);

    const [cardData, setCardData] = useState<{[k: string]: any}>({});
    useEffect(() => {
        if(_.isNumber(userInfo.id)) {
            axios.get(`/legend/${userInfo.id}`)
                .then((res) => {
                    setCardData(res.data || {});
                })
        }
    }, [userInfo]);

    const toggleCard = (index: number) => {
        // setCards(cards => [...cards].map((c, idx) => {
        //     if (idx === index) {
        //         const newC = { ...c };
        //         newC.isShow = !newC.isShow;
        //         return newC;
        //     }
        //     return c;
        // }))
    }

    return (
        <div className={`${classNamePrefix}__component ${styles.tabContent}`} style={{ marginBottom: '65px' }}>
            <div className={clsx(styles.tabTitle, styles.tabCardTitle)}>
                {/* <div className="img">
                    <img src={guardImg} alt="" />
                </div> */}
                <div className="text">
                    <h2>
                        {cardData.description}
                    </h2>
                    {/* <h6>
                        Unlock at 12:00 AM, 15 May 2021 (GMT+07:00)
                    </h6> */}
                </div>
            </div>
            <div className={styles.tabBody}>
                <div className={styles.cards}>
                    {/* {
                        cards.map((c, idx) =>  */}
                    {cardData && <div key={cardData.name} className={styles.card}>
                        <div /*onClick={() => toggleCard(cardData.name)} */>
                            {/* {!c.isShow ? <div className="img-hidden">
                                <img className="question" src={questionImg} alt="" /></div> :  */}
                                <div className="img-shown">
                                <img src={cardData.image} alt="" /></div>
                             {/* } */}
                        </div>
                        {/* <div className="info">
                            <h4>{c.id}</h4>
                            <h5>
                                <img src={ethIcon} alt="" />
                                {c.price}
                            </h5>
                        </div> */}
                    </div>}

                    {/* )
                    } */}

                </div>
            </div>

        </div>
    )
}

export default Cards;