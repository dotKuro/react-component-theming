type UseThemingVariant<TThemingVariant extends string> = () => {
  themingVariant: TThemingVariant;
  setThemingVariant: (newThemingVariant: TThemingVariant) => void;
};

export type { UseThemingVariant };
