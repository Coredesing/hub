import React, {useEffect, useState} from 'react';
import ConfirmDialog from "../../../../components/Base/ConfirmDialog";
import useStyles from "../../style";
import {useForm} from "react-hook-form";
import {renderErrorCreatePool} from "../../../../utils/validate";
import { Checkbox, Divider } from 'antd';
const CheckboxGroup = Checkbox.Group;

function UserParticipantCreatePopup(props: any) {
  const classes = useStyles();
  const {
    isOpenEditPopup, setIsOpenEditPopup, editData, isEdit,
    handleCreateUpdateData,
  } = props;

  const renderError = renderErrorCreatePool;
  const {
    register, setValue, getValues, clearErrors, errors, handleSubmit, control,
    formState: { touched, isValid }
  } = useForm({
    mode: "onChange",
    reValidateMode: 'onChange',
    defaultValues: {
      ...editData,
    },
  });

  const [users, setUsers] = useState([]);

  // For Checkbox
  const [plainOptions, setPlainOptions] = useState([]);
  const defaultCheckedList: any[] | never[] | (() => any[]) = [];
  const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);

  const onChange = (list: any[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < users.length);
    setCheckAll(list.length === users.length);
  };
  const onCheckAllChange = (e: any) => {
    const selected = users.map((it: any) => it.value);
    setCheckedList(e.target.checked ? selected : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  // For users
  useEffect(() => {
    if (editData && editData.length > 0) {
      const usersList = editData.map((it: any) => {
        return {
          label: (it.wallet_address + `(${it.email})`),
          value: it.wallet_address,
        }
      });
      setUsers(usersList);

      const lst = editData.map((it: any) => it.wallet_address);
      setPlainOptions(lst);
    }
  }, [editData]);

  const submitData = (data: any) => {
    handleCreateUpdateData && handleCreateUpdateData(checkedList);
  };

  const handleSubmitPopup = () => {
    return handleSubmit(submitData)()
      .then((res) => {
        console.log('Res: ', isValid, errors);
        if (isValid) {
          clearErrors();
        }
      });
  };
  
  return (
    <>
      <ConfirmDialog
        title={'Add'}
        open={isOpenEditPopup}
        confirmLoading={false}
        onConfirm={handleSubmitPopup}
        onCancel={() => { setIsOpenEditPopup(false); clearErrors() }}
      >
        <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
          Check all
        </Checkbox>
        <Divider />
        <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
      </ConfirmDialog>

    </>
  );
}

export default UserParticipantCreatePopup;
