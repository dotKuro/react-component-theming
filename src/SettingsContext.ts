interface SettingsContext<TSettings, TThemingVariant> {
  settings: TSettings;
  themingVariant: TThemingVariant;
  setThemingVariant: (newThemingVariant: TThemingVariant) => void;
}

export type { SettingsContext };
