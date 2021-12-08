import React from 'react'

type Props = {
    title?: string;
}
const CongratulationsIcon = ({ title }: Props) => {
    return (
        <div>
            <img src="/images/icons/congratulations.svg" alt="" width="150px" height="150px" />
            <h4>{title || 'Congratulations'}</h4>
        </div>
    )
}

export default React.memo(CongratulationsIcon)