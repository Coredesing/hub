import React from 'react';
import useStyles from './style';
// @ts-ignore
import { CSVLink } from "react-csv";

type UserProps = {
  id: string;
  email: string;
  user_telgram?: string;
  wallet_address: string;
  is_kyc: number;
  address_country: string;

  tier?: number;
  staked_pkf?: number;
  ksm_bonus_pkf?: number;
  total_pkf?: number;
}

type UserRowProps = {
  users: UserProps[];
}

const SearchForm: React.FC<UserRowProps> = (props: UserRowProps) => {
  const classes = useStyles();
  const {users} = props

  const headers = [
    { label: "ID", key: "id" },
    { label: "Wallet Address", key: "wallet_address" },
    { label: "Tier", key: "tier" },
    { label: "Staked PKF", key: "staked_pkf" },
    { label: "KSM Bonus PKF", key: "ksm_bonus_pkf" },
    { label: "Total PKF", key: "total_pkf" },
    { label: "Telegram", key: "user_telegram" },
    { label: "Email", key: "email" },
  ];

  const csvReport = {
    data: users,
    headers: headers,
    filename: 'RedKite_users.csv'
  };

  return (
    <>
      <button className={classes.exportBtn}>
        <CSVLink {...csvReport}>Export to CSV</CSVLink>
      </button>
    </>
  )
};

export default SearchForm;
