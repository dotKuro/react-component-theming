type PathTree<TTheme> = {
  [TKey in keyof TTheme]-?: TTheme[TKey] extends object ?
    [TKey] | [TKey, ...Path<TTheme[TKey]>] :
    [TKey];
};
type Path<TTheme> = PathTree<TTheme>[keyof PathTree<TTheme>];

type Dotted<TPath> =
    TPath extends [ infer THead ] ?
      THead extends string ?
        THead :
        never :
      TPath extends [ infer THead, ...(infer TRest) ] ?
        THead extends string ?
          TRest extends string[] ?
            `${THead}.${Dotted<TRest>}` :
            never :
          never :
        never;

type TemplateFunction<TTheme> = (args: { componentTheme: TTheme }) => any;
type LookupFunction<TTheme, TPath extends Path<TTheme>>
  = (dottedPath: Dotted<TPath>) => TemplateFunction<TTheme>;

type Primitive = string | number | undefined | null;
type Container = Primitive[] | Set<Primitive>;
type Value = Primitive | Container;
type AnyFunction = (...args: any[]) => Value;
type ThemeElement = AnyFunction | Value;

// We can't use Record syntax here due to restrictions on recursive types.
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
interface Theme {
  [key: string]: Theme | ThemeElement;
}

const isTheme = function (thing: Theme | ThemeElement): thing is Theme {
  return typeof thing === 'object' && thing !== null;
};

const getThemeLookupFunction = function<TTheme extends Theme> (): LookupFunction<TTheme, Path<TTheme>> {
  return <TPath extends Path<TTheme>>(path: Dotted<TPath>): TemplateFunction<TTheme> =>
    ({ componentTheme }): any => {
      let current: Theme | ThemeElement = componentTheme;

      for (const property of path.split('.')) {
        if (!isTheme(current)) {
          throw new Error('This can never happen.');
        }

        current = current[property];
      }

      return current;
    };
};

export {
  getThemeLookupFunction
};
