import { Settings } from '../Settings';
import styled from 'styled-components';
import { useComponentTheme } from '../settingsContext';
import { ComponentThemeFactoryArgs, getThemeLookupFunction, InferComponentThemeOf, ThemedWith } from 'react-component-theming';
import React, { FunctionComponent, ReactElement } from 'react';

interface GreetingProps {
  personName: string;
}

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

// The lookup function can be used to conveniently access parts of the component
// theme from within styled component styles.
const lookup = getThemeLookupFunction<ComponentTheme>();

// Use dotted paths to access parts of the component theme.
// When using TypeScript, the possible paths are suggested to you by your IDE,
// if you're using the TypeScript LSP.
const Container = styled.div<ThemedWith<ComponentTheme>>`
  background-color: ${lookup('container.backgroundColor')};
  font-size: ${lookup('container.fontSize')};
`;

const Name = styled.span<ThemedWith<ComponentTheme, HTMLSpanElement>>`
  font-style: ${lookup('name.fontStyle')};
  color: ${lookup('name.color')};
`;

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

export {
  Greeting
};