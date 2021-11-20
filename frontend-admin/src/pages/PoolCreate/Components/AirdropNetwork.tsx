import React, {useEffect} from 'react';
import useStyles from "../style";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import {Controller} from "react-hook-form";

function AirdropNetwork(props: any) {
    const classes = useStyles();
    const {
        setValue, control,
        poolDetail
    } = props;

    useEffect(() => {
        if (poolDetail && poolDetail.airdrop_network) {
            setValue('airdropNetwork', poolDetail.airdrop_network);
        }
    }, [poolDetail]);

    // console.log('userCurrentNetwork', isBscNetworks);

    return (
        <>
            <div className={classes.formControl}>
                <FormControl component="fieldset">
                    <label className={classes.formControlLabel}>Airdrop Network</label>

                    <Controller
                        control={control}
                        defaultValue={'none'}
                        name="airdropNetwork"
                        as={
                            <RadioGroup row>
                                <FormControlLabel
                                    value="none" control={<Radio />}
                                    label={'NONE'}
                                />
                                <FormControlLabel
                                    value="solana" control={<Radio />}
                                    label={'SOLANA'}
                                />
                                <FormControlLabel
                                    value="terra" control={<Radio />}
                                    label="TERRA"
                                />
                            </RadioGroup>
                        }
                    />
                </FormControl>
            </div>
        </>
    );
}

export default AirdropNetwork;
