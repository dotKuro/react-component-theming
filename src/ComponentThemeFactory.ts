interface ComponentThemeFactoryArgs<TSettings, TThemingVariant extends string> {
  settings: TSettings;
  themingVariant: TThemingVariant;
}

type ComponentThemeFactory<TSettings, TThemingVariant extends string, TComponentTheme> =
  (args: ComponentThemeFactoryArgs<TSettings, TThemingVariant>) => TComponentTheme;

export type { ComponentThemeFactory };
