import { initializeSettingsContext } from 'react-component-theming';
import { Settings } from './Settings';
import { settingsCollection } from './settingsCollection';
import { ThemingVariant } from './ThemingVariant';

const {
  SettingsProvider,
  useComponentTheme,
  useThemingVariant
} = initializeSettingsContext<Settings, ThemingVariant>({
  settingsCollection,
  initialThemingVariant: 'light'
});

export {
  SettingsProvider,
  useComponentTheme,
  useThemingVariant
};
