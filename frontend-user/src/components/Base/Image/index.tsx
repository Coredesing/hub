import React from 'react'
const ticketImg = '/images/gamefi-ticket.png';
type Props = {
    src: string,
    defaultSrc?: string,
    [k: string]: any
}
const Image = ({ src, defaultSrc, ...props }: Props) => {
    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img src={src} onError={(e: any) => {
            e.target.onerror = null;
            e.target.src = defaultSrc || ticketImg;
        }} {...props} />
    )
}

export default React.memo(Image)