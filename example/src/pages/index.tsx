import { ComponentThemeFactory } from 'react-component-theming';
import { Settings } from '../Settings';
import { ThemingVariant } from '../ThemingVariant';
import React, { FunctionComponent, ReactElement } from 'react';
import { useComponentTheme, useThemingVariant } from '../settingsContext';

interface IndexTheme {
  textColor: string;
  backgroundColor: string;
}

const useIndexTheme: ComponentThemeFactory<Settings, ThemingVariant, IndexTheme> =
  function ({ settings }): IndexTheme {
    return {
      textColor: settings.textColor,
      backgroundColor: settings.backgroundColor
    };
  };

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
