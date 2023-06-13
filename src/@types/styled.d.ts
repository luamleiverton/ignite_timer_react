import 'styled-components';
import { defaultTheme } from '../styles/themes/default'

type ThemeType = typeOf defaultTheme;

declare module 'styled-components' {
    export interface DefaultTheme extends ThemeType {}
}