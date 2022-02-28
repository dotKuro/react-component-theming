# react-component-theming

When developing user interfaces, we want to have a consistent design language.
This is usually achieved by applying a theme to the entire application.
In the best case, the theme is very generic and only contains abstract information,
such as color palette, sizes, font choices etc.

In praxis though, we need much more specific information to actually implement
the UI. We can't just use a color palette, we have to know how which colors to
apply to which parts of our frontend components. Which of the font sizes should
be used by a headline? This leads us to write less abstract themes and add a lot
of more concrete information.

Some design systems try to keep things organized by defining abstract components
in the theme itself. They might provide a set of standard buttons for submitting,
canceling, deleting and so on, allowing the user to choose which flavor they want.

Experience shows, however, that there are always exceptions and over time, a lot
of these exceptions will end up in the central theme, even though they are
concerned with very component specific matters. Once these details change in
the components itself, they often get forgotten and remain silently rotting in
the central theme.

We want to propose a different solution.
Our approach splits the theme into things that should apply application wide,
like colors, fonts and so on, and things that should apply to specific
components.

To achieve this, we derive an isolated theme for every component from a set of
application wide settings. We call these [component themes](#component-theme) 
and [settings](#settings).

This way, every component is responsible for the details of its
own appearance, keeping details out of the application wide settings.
At the same time, all components draw the values their themes are based on from
the same source, ensuring uniform looks and easy re-skinning.

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
all of your [theming variants](#theming-variant) and the
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

This guide is based on the [next.js example](https://github.com/dotKuro/react-component-theming/tree/main/examples/nextjs)
provided by this repository.

### Set up your application

First, you need to define the application wide `Settings` and provide it to the
components in your application.

#### Declaring the types

This step is optional if you're not using TypeScript.

##### Create the `Settings` type

The settings type defines the structure of the application wide `Settings`.

```typescript
// src/Settings.ts

interface Settings {
  // Define some basic settings here.
  // Remember that these should be generic and not referring to any specific
  // component.
  textColor: string;
  backgroundColor: string;
  // ...
}
```

##### Create the `ThemingVariant` Type

This is where you define what variants your theme will provide.
In most cases, this will be just `light` and `dark`, or even just `light` if you
don't plan on implementing a dark theme.
You can add variants later at any point, so just start out with what you think
you need.

```typescript
// src/ThemingVariant.ts

// Should be a union type of strings, like this one
type ThemingVariant = 'light' | 'dark';
```

#### Create the `settingsCollection`

This is where the actual values of your `Settings` live.
You'll have to provide one `Settings` object for each variant you defined
previously.

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

#### Use the context provider

To access the `Settings` objects we defined in the previous step, we will use
hooks. These hooks need the `SettingsContext` provider to work.
Calling `initializeSettingsContext` will yield the context provider and the
hooks.

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

You should place the `SettingsProvider` somewhere high up in the application,
above all components that require theming.

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

### Writing and using component themes

Each component uses its own theme that is derived from the `Settings`.
To create this theme, you need to provide a `ComponentThemeFactory` inside your
component file.

```tsx
import { ComponentThemeFactoryArgs } from 'react-component-theming';
import { Settings } from '../Settings';

const componentThemeFactory =
  function ({ settings }: ComponentThemeFactoryArgs<Settings>) {
    return {
      container: {
        // Sometimes the Settings and component theme are very similar.
        color: settings.textColor,
        backgroundColor: settings.backgroundColor
      },
      button: {
        // Settings can be re-used, re-purposed and combined to create a
        // style unique to this component.
        color: settings.textColor,
        backgroundColor: settings.backgroundColor,
        borderColor: settings.textColor,
        
        // Some values are specific to this component only, they live here and
        // not in the Settings.
        borderWidth: '1px'
      }
    };
  };
```

The factory receives the settings object and returns a new object, the component
theme.

To use this theme in your component, you can use the `useComponentTheme` hook.

```tsx
const Index: FunctionComponent = function (): ReactElement {
  const { componentTheme } = useComponentTheme(componentThemeFactory);

  return (
    <div
      style={{ ...componentTheme.container }}
    >
      <p>
        Hello World
      </p>
      <button style={{ ...componentTheme.button }} >Do something</button>
    </div>
  );
};
```

If you're using TypeScript, you can use the `InferComponentThemeOf` helper to
derive the type of the `ComponentTheme` created by your factory.

```tsx
import { ComponentThemeFactoryArgs } from 'react-component-theming';
import { Settings } from '../Settings';

const componentThemeFactory =
  function ({ settings }: ComponentThemeFactoryArgs<Settings>) {
    return {
      textColor: settings.textColor,
      backgroundColor: settings.backgroundColor
    };
  };

type IndexTheme = InferComponentThemeOf<typeof componentThemeFactory>;
```

### Working with the theming variants

One of the things that makes this theming approach very powerful is, that we
can replace the `Settings` to achieve a different look. Every time the 
`useComponentTheme` hook is run, it uses the currently active theming variant
to derive the component theme.

We can switch the theming variant using the `useThemingVariant` hook.

```tsx
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
      style={{ ...componentTheme.container }}
    >
      <p>
        Hello World
      </p>
      <button
        style={{ ...componentTheme.button }}
        onClick={ (): void => handleChangeTheme() }
      >
        Change Theme
      </button>
    </div>
  );
};
```

### Usage with styled-components

This library works well with styled-components. There are some helpers available
to apply your component themes directly to styled-components.

#### Accessing values from the component theme

The main helper is the `lookup` function. You can obtain it by calling
`getThemeLookupFunction`.


```tsx
// Write your component theme factory as usual.
const componentThemeFactory =
  ({ settings }: ComponentThemeFactoryArgs<Settings>) => ({
    container: {
      backgroundColor: settings.backgroundColor,
      fontSize: '28pt',
    },
    name: {
      fontStyle: 'bold',
      color: settings.textColor
    }
  });

type ComponentTheme = InferComponentThemeOf<typeof componentThemeFactory>;

const lookup = getThemeLookupFunction<ComponentTheme>();
```

If you're using TypeScript, be sure to infer the component theme type and provide
is to `getThemeLookupFunction`. That way, `lookup` will know what your theme
looks like and warn you if try to access things that don't exist.

You can use the `lookup` function in the template literal of your styled
component. The dotted paths correspond to paths inside the component theme.

```tsx
const Container = styled.div`
  background-color: ${lookup('container.backgroundColor')};
  font-size: ${lookup('container.fontSize')};
`;
```

If you're using TypeScript, you'll want to use the `ThemedWith` helper to infer
the props type of the component. You can use it with just one argument if you
don't need any props besides `componentTheme`. If you need to use props of
the underlying component, you can pass the component as the second argument.
If you need to use additional props, you can pass them as the last parameter.

```tsx
const Foo = styled.span<ThemedWith<ComponentTheme>>`
  font-style: ${lookup('name.fontStyle')};
  color: ${lookup('name.color')};
`;

const Bar = styled.span<ThemedWith<ComponentTheme, HTMLSpanElement>>`
  font-style: ${lookup('name.fontStyle')};
  color: ${lookup('name.color')};
`;

const Baz = styled.span<ThemedWith<ComponentTheme, { additional: string }>>`
  font-style: ${lookup('name.fontStyle')};
  color: ${lookup('name.color')};
`;

const Quux = styled.span<ThemedWith<ComponentTheme, HTMLSpanElement, { additional: string }>>`
  font-style: ${lookup('name.fontStyle')};
  color: ${lookup('name.color')};
`;
```

Don't forget to pass the component theme to these Components!

```tsx
const Greeting: FunctionComponent<GreetingProps> = function ({
  personName
}): ReactElement {
  const { componentTheme } = useComponentTheme(componentThemeFactory);

  return (
    <Container componentTheme={ componentTheme }>
      Hey, <Name componentTheme={ componentTheme }>{ personName }</Name>! Nice to see you.
    </Container>
  );
};
```
