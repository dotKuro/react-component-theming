import { SettingsCollection } from './SettingsCollection';

type UseSettingsCollection<TSettings, TThemingVariant extends string> = () => {
  settingsCollection: SettingsCollection<TSettings, TThemingVariant>;
};

export type { UseSettingsCollection };
