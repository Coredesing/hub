import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, withWidth, Hidden } from "@material-ui/core";
import useStyles from "./style";

const guideFAQs = [
  {
    name: "Guide",
    childs: [
      {
        title: "Before Joining IDOs",
        href: "https://redkite-faq.polkafoundry.com/guides/before-joining-idos.html",
      },
      {
        title: "Tier and Reputation",
        href: "https://redkite-faq.polkafoundry.com/guides/tier.html",
      },
      {
        title: "How to Swap Tokens",
        href: "https://redkite-faq.polkafoundry.com/guides/swap.html",
      },
      {
        title: "How to claim tokens",
        href: "https://redkite-faq.polkafoundry.com/guides/claim.html",
      },
      {
        title: "My Account",
        href: "https://redkite-faq.polkafoundry.com/guides/myaccount.html",
      },
    ],
  },
  {
    name: "FAQs",
    childs: [
      {
        title: "Get started with Red Kite",
        href: "https://redkite-faq.polkafoundry.com/faqs/get-started.html",
      },
      {
        title: "Allocation Result & Buying",
        href: "https://redkite-faq.polkafoundry.com/faqs/allocation-result-and-buying.html",
      },
      {
        title: "KYC",
        href: "https://redkite-faq.polkafoundry.com/faqs/kyc.html",
      },
      {
        title: "Claim",
        href: "https://redkite-faq.polkafoundry.com/faqs/claim.html",
      },
      {
        title: "Staking",
        href: "https://redkite-faq.polkafoundry.com/faqs/staking.html",
      },
      {
        title: "Others",
        href: "https://redkite-faq.polkafoundry.com/faqs/others.html",
      },
      {
        title: "Whitelist",
        href: "https://redkite-faq.polkafoundry.com/faqs/whitelist.html",
      },
    ],
  },
];

const ButtonMailto = (props: any) => {
  return (
    <Link
      to="#"
      onClick={(e) => {
        window.location = props.mailto;
        e.preventDefault();
      }}
    >
      {props.label}
    </Link>
  );
};

const NeedHelp = (props: any) => {
  const styles = useStyles();
  const [listQuestions] = useState(guideFAQs);

  return (
    <div className={styles.pageNeedHelp}>
      <h2 className={styles.title}>Need some help?</h2>
      <div className={styles.sectionBody}>
        <Hidden smDown>
          <img
            className={styles.iconSectionBody}
            src="/images/account_v3/icons/icon_support_email.svg"
            alt=""
          />
        </Hidden>
        <div>
          <div className={styles.subTitle}>
            <Hidden mdUp>
              <img
                className={styles.iconSectionBody}
                src="/images/account_v3/icons/icon_support_email.svg"
                alt=""
              />
            </Hidden>
            Support Email
          </div>
          <div className={styles.des}>
            If you have any questions, please contact us at any moment via{" "}
            <ButtonMailto
              label="support@gamefi.org"
              mailto="mailto:support@gamefi.org"
            />
            .
          </div>
        </div>
      </div>
      {/*<div className={`${styles.sectionBody} ${styles.sectionBodyQuestions}`}>*/}
      {/*  <Hidden smDown>*/}
      {/*    <img*/}
      {/*      className={styles.iconSectionBody}*/}
      {/*      src="/images/account_v3/icons/icon_guide_FAQs.svg"*/}
      {/*      alt=""*/}
      {/*    />*/}
      {/*  </Hidden>*/}
      {/*  <div style={{ width: "100%" }}>*/}
      {/*    <div className={styles.subTitle}>*/}
      {/*      <Hidden mdUp>*/}
      {/*        <img*/}
      {/*          className={styles.iconSectionBody}*/}
      {/*          src="/images/account_v3/icons/icon_guide_FAQs.svg"*/}
      {/*          alt=""*/}
      {/*        />*/}
      {/*      </Hidden>*/}
      {/*      Guide & FAQs*/}
      {/*    </div>*/}
      {/*    /!* <div className={styles.groupSearch}>*/}
      {/*      <input placeholder="Ask a question..."/>*/}
      {/*      <Button>*/}
      {/*        <img src="/images/icons/search.svg" alt="" />*/}
      {/*      </Button>*/}
      {/*    </div> *!/*/}

      {/*    {listQuestions?.map((item, index) => {*/}
      {/*      return (*/}
      {/*        <div className={styles.boxQuestions} key={index}>*/}
      {/*          <div className={styles.nameQuestions}>{item.name}</div>*/}
      {/*          <ul className={styles.listQuestions}>*/}
      {/*            {item.childs?.map((child, i) => {*/}
      {/*              return (*/}
      {/*                <li key={i} className={styles.itemQuestions}>*/}
      {/*                  <a href={child.href} target="_blank" rel="noreferrer">*/}
      {/*                    {child.title}*/}
      {/*                  </a>*/}
      {/*                </li>*/}
      {/*              );*/}
      {/*            })}*/}
      {/*          </ul>*/}
      {/*        </div>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
};

export default withWidth()(NeedHelp);
