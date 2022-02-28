import { ComponentType } from 'react';

type ThemedWith<TComponentTheme, TPropsOrComponent = unknown, TAdditionalProps = unknown> =
  TPropsOrComponent extends ComponentType<infer TProps> ?
    ComponentType<{ componentTheme: TComponentTheme } & TProps & TAdditionalProps> :
    { componentTheme: TComponentTheme } & TPropsOrComponent & TAdditionalProps;

export type {
  ThemedWith
};
