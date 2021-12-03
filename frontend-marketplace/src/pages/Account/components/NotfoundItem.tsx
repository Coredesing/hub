import React from 'react'

const NotfoundItem = () => {
    return (
        <div className="wrapper-not-found">
            <img src="/images/icons/item-not-found.svg" alt="" />
            <h4>No item found</h4>
        </div>
    )
}

export default React.memo(NotfoundItem)
