import React, {useState} from 'react';
import {Button} from "@material-ui/core";
import {useCommonStyle} from "../../../../styles";
import {pickerRandomWinner} from "../../../../request/participants";
import {useDispatch} from "react-redux";
import {alertFailure, alertSuccess} from "../../../../store/actions/alert";
import {PICK_WINNER_RULE} from "../../../../constants";

function UserPickerToWinner(props: any) {
  const commonStyle = useCommonStyle();
  const { poolDetail } = props;
  const dispatch = useDispatch();
  const [inputPicker, setInputPicker] = useState('');

  const handlePickerRandom = async (rule: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want pick random ?')) {
      return false;
    }

    const pickerNumber = parseInt(inputPicker);
    console.log('pickerNumber', pickerNumber);

    // Call API random
    await pickerRandomWinner(poolDetail?.id, rule)
      .then((res) => {
        console.log('[pickerRandomWinner] - res', res);
        if (res.status === 200) {
          dispatch(alertSuccess('Picker to Random Success'));
        } else {
          dispatch(alertFailure('Picker to Random Fail'));
        }
      });
  };

  return (
    <>
      <div style={{
        paddingLeft: 60,
        display: 'inline-block',
      }}>
        <input
          type={'number'}
          className={commonStyle.inputSearch}
          placeholder="Picker to winner"
          style={{
            width: 180,
          }}
          value={inputPicker}
          min={0}
          step={1}
          onChange={(e) => {
            setInputPicker(e.target.value)
          }}
        />
        {/*<Button*/}
        {/*  variant="contained"*/}
        {/*  color="primary"*/}
        {/*  onClick={() => handlePickerRandom(PICK_WINNER_RULE.RULE_NORMAL)}*/}
        {/*  style={{ marginLeft: 10, marginTop: -5 }}*/}
        {/*>Normal Rule</Button>*/}

        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePickerRandom(PICK_WINNER_RULE.RULE_GAMEFI_TICKET)}
          style={{ marginLeft: 10, marginTop: -5 }}
        >GameFI Ticket</Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePickerRandom(PICK_WINNER_RULE.RULE_BASE_ON_SNAPSHOT)}
          style={{ marginLeft: 10, marginTop: -5 }}
        >Base on snapshot</Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePickerRandom(PICK_WINNER_RULE.RULE_WITH_WEIGHT_RATE)}
          style={{ marginLeft: 10, marginTop: -5 }}
        >Weight Rate</Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePickerRandom(PICK_WINNER_RULE.RULE_LUCKY_DOVE)}
          style={{ marginLeft: 10, marginTop: -5 }}
        >Lucky Dove</Button>
      </div>

    </>
  );
}

export default UserPickerToWinner;
