import React, { Fragment, FunctionComponent, ReactElement } from 'react';
import { Greeting } from '../components/Greeting';
import { useThemingVariant } from '../settingsContext';

const Index: FunctionComponent = function (): ReactElement {
  const { themingVariant, setThemingVariant } = useThemingVariant();

  const handleChangeTheme = function (): void {
    if (themingVariant === 'light') {
      setThemingVariant('dark');

      return;
    }

    setThemingVariant('light');
  };

  return (
    <Fragment>
      <Greeting personName='Gunnar'/>
      <button onClick={ (): void => handleChangeTheme() }>
        Change Theme
      </button>
    </Fragment>
  );
};

export default Index;
