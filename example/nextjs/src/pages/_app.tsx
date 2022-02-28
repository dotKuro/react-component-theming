import { AppProps } from 'next/app';
import { SettingsProvider } from '../settingsContext';
import React, { FunctionComponent, ReactElement } from 'react';

const App: FunctionComponent<AppProps> = function ({
  Component,
  pageProps
}): ReactElement {
  return (
    <SettingsProvider>
      <Component { ...pageProps } />
    </SettingsProvider>
  );
};

export default App;
