import { createTheme } from '@material-ui/core/styles';
import { ZIndex } from '@material-ui/core/styles/zIndex';
import { ThemeOptions } from '@material-ui/core/styles/createTheme';

declare module '@material-ui/core/styles/zIndex' {
  interface ZIndex {
    negative: number;
  }
}

declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    zIndex: ZIndex;
  }

  interface ThemeOptions {
    custom?: any;
  }
}

export const createLemonadeTheme = (options: ThemeOptions = {}) => {
  return createTheme(options);
};

const themeOptions = {
  colors: {
    primary: '#FFCC00',
    secondary: '#3A39BB',
    primaryText: '#636363',
    secondaryText: '#363636',
    metamask: '#FF8F44',
    mainBackground: '#202020',
  },
};

const defaultTheme = createLemonadeTheme({
  custom: themeOptions,
});

export { themeOptions };
export default defaultTheme;