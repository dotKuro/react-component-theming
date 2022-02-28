import { ComponentThemeFactoryArgs } from './ComponentThemeFactoryArgs';

type InferComponentThemeOf<TFactory extends (args: ComponentThemeFactoryArgs<any>) => any> =
  ReturnType<TFactory>;

export type {
  InferComponentThemeOf
};
