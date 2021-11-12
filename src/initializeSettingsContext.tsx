import { ComponentThemeFactory } from './ComponentThemeFactory';
import { SettingsCollection } from './SettingsCollection';
import { SettingsContext } from './SettingsContext';
import { SettingsProvider } from './SettingsProvider';
import { UseComponentTheme } from './UseComponentTheme';
import { UseSettings } from './UseSettings';
import { UseThemingVariant } from './UseThemingVariant';
import React, { createContext, ReactElement, useContext, useMemo, useState } from 'react';

interface InitializeSettingsContextArgs<TSettings, TThemingVariant extends string> {
  settingsCollection: SettingsCollection<TSettings, TThemingVariant>;
}

const initializeSettingsContext = function<TSettings, TThemingVariant extends string> ({
  settingsCollection
}: InitializeSettingsContextArgs<TSettings, TThemingVariant>): {
    SettingsProvider: SettingsProvider<TThemingVariant>;
    useComponentTheme: UseComponentTheme<TSettings, TThemingVariant>;
    useSettings: UseSettings<TSettings>;
    useThemingVariant: UseThemingVariant<TThemingVariant>;
  } {
  // This is the generic SettingsContext type of the provider therefore this name scheme here makes sense.
  // eslint-disable-next-line @typescript-eslint/naming-convention
  type TSettingsContext = SettingsContext<TSettings, TThemingVariant>;
  const settingsContext = createContext({} as TSettingsContext);

  const SettingsProviderComponent: SettingsProvider<TThemingVariant> = function ({
    initialThemingVariant,
    children
  }): ReactElement {
    const [ themingVariant, setThemingVariant ] = useState(initialThemingVariant);
    const settings = useMemo(
      (): TSettings => settingsCollection[themingVariant],
      [ themingVariant ]
    );
    const value = useMemo(
      (): TSettingsContext => ({
        settings,
        themingVariant,
        setThemingVariant (newThemingVariant): void {
          setThemingVariant(newThemingVariant);
        }
      }),
      [ settings, themingVariant ]
    );

    return (
      <settingsContext.Provider
        value={ value }
      >
        { children }
      </settingsContext.Provider>

    );
  };

  const useSettings: UseSettings<TSettings> = function (): ReturnType<UseSettings<TSettings>> {
    const { settings } = useContext(settingsContext);

    return { settings };
  };

  const useThemingVariant: UseThemingVariant<TThemingVariant> =
    function (): ReturnType<UseThemingVariant<TThemingVariant>> {
      const { themingVariant, setThemingVariant } = useContext(settingsContext);

      return { themingVariant, setThemingVariant };
    };

  const useComponentTheme: UseComponentTheme<TSettings, TThemingVariant> =
    function<TComponentTheme>(
      componentThemeFactory: ComponentThemeFactory<TSettings, TThemingVariant, TComponentTheme>
    ): TComponentTheme {
      const { settings } = useSettings();
      const { themingVariant } = useThemingVariant();

      return componentThemeFactory({ settings, themingVariant });
    };

  return {
    SettingsProvider: SettingsProviderComponent,
    useComponentTheme,
    useSettings,
    useThemingVariant
  };
};

export { initializeSettingsContext };
