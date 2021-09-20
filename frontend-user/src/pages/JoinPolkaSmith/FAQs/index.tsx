import Collapse from "@kunukn/react-collapse";
import React, {useState} from "react";
import useStyles from '../style';

const iconUP = '/images/polkasmith/icon_up.png';
const arrowUp = '/images/polkasmith/arrow_up.png';
const fqaList = [
    {
        title: "What is PolkaSmith? What is PKS?",
        content: "PolkaSmith is the canary network of PolkaFoundry on Kusama, and PKS is PolkaSmith’s native token."
    },
    {
        title: "What does “Canary” mean?",
        content: "By saying PolkaSmith is a canary chain of PolkaFoundry, we mean PolkaSmith is an experimental platform for us to test all features of PolkaFoundry before we become a parachain on Polkadot."
    },
    {
        title: "What are the similarities and differences between PolkaSmith and PolkaFoundry?",
        content: (<p>Similarities:<br/>
            - PolkaFoundry and PolkaSmith are both one-stop production hubs for creating borderless and frictionless Defi & NFT applications. So they share similar features.<br/>
            - PolkaFoundry and PolkaSmith are sisters chains since they share the same project team.<br/>
            <br/>
            Differences:<br/>
            - PolkaFoundry is implemented on the Polkadot Network to serve enterprises and B2B applications that require high stability and dependability. Meanwhile, PolkaSmith, which is implemented on Kusama Network, is more suitable for early-stage startups that need to grow quickly and easily experiment with bold new ideas.<br/>
            - PolkaFoundry will bid for the Polkadot parachain auction while PolkaSmith will bid for the Kusama parachain auction.</p>)
    },
    {
        title: "What is the purpose of creating PolkaSmith, a canary network on Kusama?",
        content: <p>1. This pair of Mainnet - Canary happens to almost all other parachains.<br/>
            Polkadot vs Kusama<br/>
            Acala - Kurura<br/>
            Moonbeam - Moonriver<br/>
            Plasm - Shiden<br/><br/>
            2. As PolkaFoundry canary network, PolkaSmith is a good platform to try out all PolkaFoundry features before it launches on Polkadot. It will also let dapps building on PolkaFoundry like NFTify and Swaperry have a canary platform to work in before landing on Polkadot.<br/><br/>
            3. PolkaSmith will be a platform for those who want to move fast and innovate on Kusama network, especially startups with bold ideas.</p>
    },
    {
        title: "Why is PolkaSmith built on Kusama?",
        content: <p>Kusama is Polkadot's faster, wilder cousin – a multi-chain network for radical innovation.<br/>
            Kusama and Polkadot are independent, standalone networks built in nearly the same way, but Kusama has faster governance parameters and higher risk tolerance.<br/>
            By launching on Kusama, PolkaSmith can push the limits of what's possible, giving the PolkaFoundry team a place to support bold new dapps. PolkaSmith will access Kusama's plug-and-play security while enjoying high-capacity processing speeds, micro-gas fees, and interoperability between multiple networks; all ultimately bridged to Polkadot.<br/></p>
    },
    {
        title: "Has PolkaSmith launched?",
        content: "Not yet. Even though we have our testnet and all the technical aspects ready, we will have to wait for a parachain slot to bring into practice. We will launch PolkaSmith once we win a parachain on Kusama Network."
    },
    {
        title: "Will PolkaSmith replace or take the spotlight of PolkaFoundry?",
        content: "No. Eventually, the professional apps will run on PolkaFoundry, and only experimental apps will run on Polkasmith."
    },
    {
        title: "Are PKS and PKF different?",
        content: <p>Yes, PKS and PKF are two separate tokens.<br/><br/>
            PKF is the native token of PolkaFoundry, while PKS is the native token of PolkaSmith. But please note that PolkaSmith is PolkaFoundry sister/ canary chain on Kusama.</p>
    },
    {
        title: "Why generating extra tokens instead of migrating?",
        content: <p>(1) Again, it is a standard practice of almost all parachains.<br/>
            Polkadot vs Kusama<br/>
            Acala - Kurura<br/>
            Moonbeam - Moonriver<br/>
            Plasm - Shiden<br/><br/>
            Their tokens are also independent.<br/><br/>
            (2) PKS has it own utilities. It is used by dapp on PolkaSmith on Kusama.<br/><br/>
            (3) In addition, we found that independent tokens give us the necessary resources. We could use the PKF budget to run Polkasmith (migrating tokens), and that is what we intend to do initially. But it turns out that Kusama auction is so costly. Suppose we spend like 10% total supply of PKF on this; there will be not much remaining for Polkadot auction later. So generating a new token is the only way we can win both Kusama and Polkadot parachain slots.</p>
    },
    {
        title: "Is PKS listed yet?",
        content: "PKS isn't listed yet. But we will list PKS as soon as we win the parachain slot on Kusama."
    },
    {
        title: "What are the utilities of Polkasmith $PKS?",
        content: <p>PKS utilities include:<br/>
            + Ecosystem: to support Dapps on Polkasmith (pay fees, governance, etc.) and expand our ecosystem;<br/>
            + Treasury: to buy and hold Ksm so the network itself will have enough Ksm to ensure it can constantly renew the slot;<br/>
            + Parachain auction: to bid for Kusama auction;<br/>
            + Parachain auction reserve: to bid for Kusama auction when needed.<br/>
            ...<br/><br/>
            Please refer to the PolkaSmith tokenomics in the article: <a href={"https://medium.com/polkafoundry/jun-14-official-update-about-polkasmith-and-parachain-auction-plan-on-kusama-network-f29c00e1e466"}>https://medium.com/polkafoundry/jun-14-official-update-about-polkasmith-and-parachain-auction-plan-on-kusama-network-f29c00e1e466</a></p>
    },
    {
        title: "Will PKS take the spotlight away from PKF?",
        content: <p>In the short term, when Kusama auction is running, you will feel PKS took some spotlight away from PKF. But when Polkadot parachain auction opens a few months from now, PKF will shine.</p>
    },
    {
        title: "Why does PolkaSmith compete for the Kusama Parachain slot? Why not skiping Kusama and bid for Polkadot parachain later?",
        content: <p>(1) For PolkaFoundry and PolkaSmith, winning a parachain slot on Kusama is very important to ensure all the products developed on PolkaFoundry can run smoothly before the official deployment on Polkadot.<br/><br/>
            (2) If we don't win Kusama parachain, we run into the risk of our dapps migrating to our competitor platforms. The apps built on us like NFTify and Swaperry may be eager to switch to other networks if we do not win Kusama, because they cannot wait too long for a runnable application.<br/><br/>
            (3) If PolkaSmith becomes a parachain on Kusama, it can prove our solution works. Therefore, we are more likely to win parachain on Polkadot than waiting and bidding directly for Polkadot auction, bypassing Kusama.</p>
    },
    {
        title: "Did we win a parachain slot ?",
        content: <p>Now we are bidding for Kusama parachain auction, no one wins yet. Please find more auction details here: <a href={"https://kusama.network/auctions"}>https://kusama.network/auctions</a></p>
    },
    {
        title: "When is Kusama parachain auction?",
        content: <p>It starts on 15 June. And there will be one auction weekly. Please find more auction details here: <a href={"https://kusama.network/auctions"}>https://kusama.network/auctions</a></p>
    },
    {
        title: "If I contribute KSM to PolkaSmith crowdloan in another platform (not Red Kite), can I get the same rewards?",
        content: <p>You can obtain the same PKS rewards no matter what platform you use to contribute. But you need to use the Polkadot.js Browser Extension if you want to claim the Red Kite's Point rewards.</p>
    },
    {
        title: "What is the deadline for 10% early bird rewards?",
        content: <p>It is due on 19 June.</p>
    },
    {
        title: "What is the vesting schedule for the rewards?",
        content: <p>Contributors will receive 35% of their reward PKS on the day PolkaSmith starts its parachain, then continue receiving their remaining PKS monthly over ten months.</p>
    },
    {
        title: "How to get my PKS reward?",
        content: <p>We will announce how contributors get PKS rewards in detail later. Please stay tuned!</p>
    },
    {
        title: "How will PKF holders benefit from the introduction of PKS and PolkaSmith bidding for Kusama auction ?",
        content: <p>Winning Kusama parachain is a critical step to PolkaFoundry as we explained above. That is why we have to benefit KSM staker (the ones who help us win parachain).<br/><br/>
            But winning KSM parachain will validate our technology and thus bring trust and value to PolkaFoundry. Therefore, it will benefit PKF token holders eventually.</p>
    },
    {
        title: "What is Red Kite Point?",
        content: <p>Red Kite Point is not a token; it is just a unique point on our launchpad, Red Kite.<br/><br/>
            Each Red Kite point is equivalent to 1 PKF staked on Red Kite. Even if you don't stake any PKF on Red Kite, you can get the same rank benefits.<br/><br/>
            Note: Red Kite point is only meaningful in red kite, it no longer exists when KSM gets unlocked.</p>
    },

]
const FAQs = (props: any) => {
    const styles = useStyles();
    const [question, setQuestion] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const selectQuestion = (index: React.SetStateAction<number>) => {
        if (index === question) {
            setQuestion(0)
        } else {
            setQuestion(index)
        }
    }
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    document.addEventListener("scroll", (e) => {
        if (window.pageYOffset > 600) {
            setShowScrollTop(true)
        } else {
            setShowScrollTop(false)
        }
    });
    // @ts-ignore
    return (
        <div className={styles.askedQuestions}>
            <h1 style={{fontSize: 44}}>Frequently Asked Questions</h1>
            <div className={styles.questionList}>
                {
                    fqaList.map((value, index) => {
                        return (
                            <div className={styles.questionItem} key={index}>
                                <div onClick={() => {
                                    selectQuestion(index +1)
                                }} className={styles.questionTitle}>
                                    <h3>{ value.title }</h3>
                                    <div style={{display: "inline-block", textAlign: "right"}}>
                                        <img className={styles.navQuestion} src={iconUP} width={15} height={8}
                                             style={(question === index + 1) ? {transform: "rotate(180deg)"} : {}}/>
                                    </div>
                                </div>
                                <div className={styles.questionContent}>
                                    <Collapse isOpen={question === index + 1}>
                                        {value.content}</Collapse>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div onClick={() => {
                scrollToTop()
            }} className={styles.scrollTop}
                 style={(showScrollTop) ? {display: "block"} : {display: "none"}}>
                <img width={32} height={32} src={arrowUp}/>
                <h3>Back to top</h3>
            </div>
        </div>
    );
}
// @ts-ignore
export default FAQs;