⚠️⚠️⚠️ UNMAINTAINED ⚠️⚠️⚠️


# react-component-theming

Usually consistent theming across multiple components is achieved
on an application level. In the best case this happens in a very
generic way. For example:`primary-color`, `accent-color`,
`spacing(xs|sm|md|lg|xl)`. But in most cases this doesn't do the
trick. A lot of exceptions for very component specific matters
will end up in the central theme. Once these details change in
the components itself, they often get forgotten and remain
silently rotting in the central theme.

In order to avoid the above, this theming solution aims to
separate the mentioned really specific parts from the central
theme while keeping the good generic stuff in there. This is
achieved by [component themes](#component-themes) which are,
as the name suggests, themes on a component level and
[settings](#settings) which are generic values on the
application level.

## Concepts

### Settings
Settings are generic values that apply to the whole application.
These should be as generic as possible and not contain any
details of any specific component. The specific values contained
in the settings of an application are different on an application
basis and this library makes no assumptions about it. Recommended
values for settings are values like `primaryColor`,
`accentColor`, `headingFontSize`, `textFontSize` and a function
that returns consistent spacing values for multiple sizes.

### Theming Variant
A theming variant is a name for one specific settings object.
Your application can contain a different settings object for
each theming variant of the app. Examples for theming variants
would be `light` and `dark`.

### Settings Collection
The settings collection of your application is a mapping between
all your [theming variants](#theming-variant) and the
corresponding [settings](#settings).

### Component Theme
A component theme is a theme for a specific component.
Each component does define this theme for itself. Here you
can be as specific as you want. This theme is based on the
[settings](#settings) and the current
[theming variant](#theming-variant) making this approach really
flexible since all edge cases can be handled in the component.
Therefore, components continue to work in isolation.

## Getting Started

This guide is based on the [example](https://github.com/dotKuro/react-component-theming/tree/main/example)
provided by this repository.

### Create your Settings Type

```typescript
// src/Settings.ts

interface Settings {
  // Use here what you need
  textColor: string;
  backgroundColor: string;
  // ...
}
```

### Create your Theming Variant Type

```typescript
// src/ThemingVariant.ts

// Should be a union type of strings, like this one
type themingVariant = 'light' | 'dark';
```

### Create your Settings Collection
```typescript
// src/SettingsCollection.ts

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
```
### Initialize the Context

```typescript
// src/settingsContext.ts

const {
  SettingsProvider,
  useComponentTheme,
  useThemingVariant
} = initializeSettingsContext<Settings, ThemingVariant>({
  settingsCollection,
  initialThemingVariant: 'light'
});
```

### Put the Provider into your Application

```typescript jsx
// src/pages/_app.tsx

const App: FunctionComponent<AppProps> = function ({ 
  Component,
  pageProps 
}): ReactElement {
  return (
    <SettingsProvider>
      <Component { ...pageProps } />;
    </SettingsProvider>
  );
};
```

### Start using it :)

Have a look [here](https://github.com/dotKuro/react-component-theming/tree/main/example/src/pages/index.tsx).
