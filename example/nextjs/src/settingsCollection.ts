import { Settings } from './Settings';
import { SettingsCollection } from 'react-component-theming';
import { ThemingVariant } from './ThemingVariant';

const settingsCollection: SettingsCollection<Settings, ThemingVariant> = {
  light: {
    textColor: 'black',
    backgroundColor: 'white'
  },
  dark: {
    textColor: 'white',
    backgroundColor: 'black'
  }
};

export { settingsCollection };
