import { assert } from 'assertthat';
import { initializeSettingsContext } from './initializeSettingsContext';
import React, { FunctionComponent, ReactElement, useEffect } from 'react';
import { render, screen } from '@testing-library/react';

suite('initializeSettingsContext', (): void => {
  test('provides initial theming variant after initialization.', async (): Promise<void> => {
    const settingsCollection = {
      variant: {}
    };

    const { SettingsProvider, useThemingVariant } = initializeSettingsContext({
      settingsCollection,
      initialThemingVariant: 'variant'
    });

    const TestComponent: FunctionComponent = function (): ReactElement {
      const { themingVariant } = useThemingVariant();

      return (
        <div>
          { themingVariant }
        </div>
      );
    };

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    assert.that(screen.getByText('variant')).is.not.null();
  });

  test('is able to change the theming variant.', async (): Promise<void> => {
    const settingsCollection = {
      variant1: {},
      variant2: {}
    };

    type ThemingVariant = 'variant1' | 'variant2';

    const { SettingsProvider, useThemingVariant } = initializeSettingsContext<unknown, ThemingVariant>({
      settingsCollection,
      initialThemingVariant: 'variant1'
    });

    const TestComponent: FunctionComponent = function (): ReactElement {
      const { themingVariant, setThemingVariant } = useThemingVariant();

      useEffect((): void => {
        setThemingVariant('variant2');
      }, []);

      return (
        <div>
          { themingVariant }
        </div>
      );
    };

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    assert.that(screen.getByText('variant2')).is.not.null();
  });

  test('provides settings to the corresponding theming variant.', async (): Promise<void> => {
    interface Settings {
      test: string;
    }
    type ThemingVariant = 'variant1' | 'variant2';
    const settingsCollection = {
      variant1: { test: 'variant1' },
      variant2: { test: 'variant2' }
    };

    const { SettingsProvider, useSettings } = initializeSettingsContext<Settings, ThemingVariant>({
      settingsCollection,
      initialThemingVariant: 'variant1'
    });

    const TestComponent: FunctionComponent = function (): ReactElement {
      const { settings } = useSettings();

      return (
        <div>
          { settings.test }
        </div>
      );
    };

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    assert.that(screen.getByText('variant1')).is.not.null();
  });

  test('provides the entire settings collection.', async (): Promise<void> => {
    interface Settings {
      test: string;
    }
    type ThemingVariant = 'variant1' | 'variant2';
    const testSettingsCollection = {
      variant1: { test: 'variant1' },
      variant2: { test: 'variant2' }
    };

    const { SettingsProvider, useSettingsCollection } = initializeSettingsContext<Settings, ThemingVariant>({
      settingsCollection: testSettingsCollection,
      initialThemingVariant: 'variant1'
    });

    const TestComponent: FunctionComponent = function (): ReactElement {
      const { settingsCollection } = useSettingsCollection();

      return (
        <div>
          { settingsCollection.variant1.test } { settingsCollection.variant2.test }
        </div>
      );
    };

    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    assert.that(screen.getByText('variant1 variant2')).is.not.null();
  });
});
