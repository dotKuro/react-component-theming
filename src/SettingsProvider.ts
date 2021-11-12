import { FunctionComponent } from 'react';

interface SettingsProviderProps<TThemingVariant extends string> {
  initialThemingVariant: TThemingVariant;
}

type SettingsProvider<TThemingVariant extends string> = FunctionComponent<SettingsProviderProps<TThemingVariant>>;

export type { SettingsProvider };
