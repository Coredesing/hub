import { makeStyles } from '@material-ui/core';
export const useTableStyles = makeStyles((theme: any) => {
    return {
        wrapperTable: {
            border: '1px solid #44454B',
            borderBottom: 'none',
            borderRadius: '4px',
            boxSizing: 'border-box',

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
            display: 'flex',
            gap: '6px',
        },
        labelSort: {
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            cursor: 'pointer',
        },
        sortIcon: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
        }
    };
});