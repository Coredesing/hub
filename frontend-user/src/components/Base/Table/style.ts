import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';
export const useTableStyles = makeStyles((theme: any) => {
    return {
        wrapperTable: {
            backgroundColor: "#000000",
            border: '1px solid #44454B',
            borderBottom: 'none',
            borderRadius: '4px',
            boxSizing: 'border-box',
            '&::-webkit-scrollbar': {
                width: '5px',
                height: '5px',
            },
            '&::-webkit-scrollbar-track': {
                background: "#888",
                borderRadius: '12px',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
            }

        },
        table: {
            border: 'none',
            position: 'relative',
            '& thead tr th': {
                padding: '14px 19px',
                background: '#171717',
                border: 'none',
            }
        },
        textGreen: {
            color: '#72F34B',
        },
        textRed: {
            color: '#F24B4B'
        },
        groupBtn: {
            ...typeDisplayFlex,
            gap: '6px',
        },
        labelSort: {
            ...typeDisplayFlex,
            gap: '4px',
            alignItems: 'center',
            cursor: 'pointer',
        },
        sortIcon: {
            ...typeDisplayFlex,
            flexDirection: 'column',
            gap: '2px',
        },
        
    };
});