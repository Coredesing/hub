import React from 'react'

type Props = {
    title?: string;
}
const NotfoundItem = ({ title }: Props) => {
    return (
        <div className="wrapper-not-found">
            <img src="/images/icons/item-not-found.svg" alt="" width="150px" height="150px"/>
            <h4>{title || 'No item found'}</h4>
        </div>
    )
}

export default React.memo(NotfoundItem)