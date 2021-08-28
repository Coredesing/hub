import React, { useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import clsx from 'clsx';
import useStyles from './style';
import { isEmail } from '../../../utils';
import axios from '../../../services/axios';

const ContactForm = ({ connectedAccount, ...props }: { [k in string]: any }) => {
    const [email, setEmail] = useState('');
    const [statusSubc, setStatusSub] = useState<{
        ok?: boolean,
        msg?: string,
        isShow: boolean,
    }>({
        ok: false,
        msg: '',
        isShow: false
    });
    const onChangeEmail = (event: any) => {
        const value = event.target.value;
        setEmail(value);
    }
    const onSubmitEmail = () => {
        if (!isEmail(email)) {
            return setStatusSub({ ok: false, msg: 'Invalid email', isShow: true });
        }
        axios.post('/home/subscribe', { email })
            .then((res) => {
                const result = res.data;
                if (result?.status === 200) {
                    setEmail('');
                    setStatusSub({ ok: true, msg: 'Subcribe succesfully. We\'ll contact to you as soos as possible!.', isShow: true });
                    setTimeout(() => {
                        setStatusSub({ isShow: false });
                    }, 4000);
                } else {
                    setStatusSub({ ok: false, msg: 'Something wrong was happened. Please try again later!', isShow: true });
                }
            }).catch(err => {
                console.log(err);
                setStatusSub({ ok: false, msg: 'Something wrong was happened. Please try again later!', isShow: true });
            })
    }


    const styles = useStyles();
    return (
        <section className={clsx(props.className, styles.contact)}>
            <div className="rectangle green">
                <img src="/images/subcriber.svg" alt="" />
            </div>
            <h3>
                Get the Latest in Your Inbox
            </h3>
            <div className={styles.contactForm}>
                <form onSubmit={(e) => { e.preventDefault(); onSubmitEmail() }}>
                    <TextField className={styles.inputForm}
                        label="Email" variant="outlined"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={onChangeEmail}
                        onSubmit={(e) => e.preventDefault()}
                    />
                    <Button className={styles.btnForm} type="submit">
                        Subscribe
                    </Button>
                </form>

                {statusSubc.isShow && <div className={clsx(styles.alertMsg, {
                    error: !statusSubc.ok,
                    success: statusSubc.ok
                }
                )}>
                    {statusSubc.ok ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM15.5355 8.46447C15.9261 8.07394 16.5592 8.07394 16.9498 8.46447C17.3403 8.85499 17.3403 9.48816 16.9498 9.87868L11.2966 15.5318L11.2929 15.5355C11.1919 15.6365 11.0747 15.7114 10.9496 15.7602C10.7724 15.8292 10.5795 15.8459 10.3948 15.8101C10.2057 15.7735 10.0251 15.682 9.87868 15.5355L9.87489 15.5317L7.05028 12.7071C6.65975 12.3166 6.65975 11.6834 7.05028 11.2929C7.4408 10.9024 8.07397 10.9024 8.46449 11.2929L10.5858 13.4142L15.5355 8.46447Z" fill="#0A0A0A" />
                    </svg>
                        : <img src={'/images/warning-red.svg'} alt="" />}
                    <span>{statusSubc.msg}</span>
                </div>}

            </div>
        </section>
    )
}

export default React.memo(ContactForm);