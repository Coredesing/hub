import { useMediaQuery } from 'react-responsive'

export const useScreens = () => {
  const screens = {
    mobile: useMediaQuery({ maxWidth: '700px' }),
    tablet: useMediaQuery({ minWidth: '701px', maxWidth: '1023px' }),
    md: useMediaQuery({ minWidth: '1024px', maxWidth: '1367px' }),
    lg: useMediaQuery({ minWidth: '1368px', maxWidth: '1919px' }),
    xl: useMediaQuery({ minWidth: '1920px' })
  }
  return screens
}
