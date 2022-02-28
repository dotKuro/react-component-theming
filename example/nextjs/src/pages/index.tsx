import { ComponentThemeFactoryArgs, InferComponentThemeOf } from 'react-component-theming';
import { Settings } from '../Settings';
import React, { FunctionComponent, ReactElement } from 'react';
import { useComponentTheme, useThemingVariant } from '../settingsContext';

const useIndexTheme =
  function ({ settings }: ComponentThemeFactoryArgs<Settings>) {
    return {
      textColor: settings.textColor,
      backgroundColor: settings.backgroundColor
    };
  };

type IndexTheme = InferComponentThemeOf<typeof useIndexTheme>;

const Index: FunctionComponent = function (): ReactElement {
  const { componentTheme } = useComponentTheme(useIndexTheme);
  const { themingVariant, setThemingVariant } = useThemingVariant();

  const handleChangeTheme = function (): void {
    if (themingVariant === 'light') {
      setThemingVariant('dark');

      return;
    }

    setThemingVariant('light');
  };

  return (
    <div
      style={{
        color: componentTheme.textColor,
        backgroundColor: componentTheme.backgroundColor
      }}
    >
      <p>
        Hello World
      </p>
      <button onClick={ (): void => handleChangeTheme() }>
        Change Theme
      </button>
    </div>
  );
};

export default Index;
