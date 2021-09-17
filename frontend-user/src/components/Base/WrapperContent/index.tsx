import React from 'react'

type Props = {
    useShowBanner?: boolean,
    children: any,
    isShowBannerContract?: boolean,
}
const WrapperContent = ({
    useShowBanner = true,
    children,
    isShowBannerContract,
}: Props) => {
    return (
        <>
            {
                useShowBanner && isShowBannerContract ? React.cloneElement(children, {isShowBannerContract}) : children
            }
        </>
    )
}

export default WrapperContent
