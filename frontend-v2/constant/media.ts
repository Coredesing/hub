import { useMediaQuery } from 'react-responsive'

export const IsMobile = () =>   useMediaQuery({ query: `(max-width: 1000px)` })