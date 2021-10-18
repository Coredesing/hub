import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    activeTab: {
        background: '#fff',
        fontWeight: 'bold',
        color: 'rgba(79,70,229)',
        padding: 5,
        paddingRight:10,
        paddingLeft:10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        border: 'none',
        borderBottom: '3px solid rgba(79,70,229)',
        cursor: 'pointer',
    },
    deActiveTab: {
        cursor: 'pointer',
        background: '#ffffff',
        color: '#000000a0',
        padding: 5,
        paddingRight:15,
        paddingLeft:15,
        border: 'none'
    }
}))

export default useStyles;
