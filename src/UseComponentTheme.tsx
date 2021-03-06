import { ComponentThemeFactory } from './ComponentThemeFactory';

type UseComponentTheme<TSettings, TThemingVariant extends string> =
  <TComponentTheme>(args: ComponentThemeFactory<TSettings, TThemingVariant, TComponentTheme>) => {
    componentTheme: TComponentTheme;
  };

export type { UseComponentTheme };
