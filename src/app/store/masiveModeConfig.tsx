import { atom } from "jotai";
import { produce } from "immer";
import { ISignature } from "./signatures";

export interface SignatureConfigValues {
  positionX: number;
  positionY: number;
  widthCm: number;
  randomX: number;
  randomY: number;
  rotation: number;
  opacity: number;
}

type SignatureConfigKeys = keyof SignatureConfigValues;

export const initialConfigValues: SignatureConfigValues = {
  positionX: 50, //Percentajes value
  positionY: 50, //Percentaje value
  widthCm: 2.5,
  randomX: 0,
  randomY: 0,
  rotation: 0,
  opacity: 100,
};

export const initialConfig: {
  isConfigured: boolean;
  data: SignatureConfigValues;
} = {
  isConfigured: false,
  data: initialConfigValues,
};

export interface MasiveModeConfig {
  signatures: {
    first: {
      isConfigured: boolean;
      data: SignatureConfigValues;
      signature: ISignature;
    }[];

    last: {
      isConfigured: boolean;
      data: SignatureConfigValues;
      signature: ISignature;
    }[];
  };
}

const masiveModeConfigPrimitiveAtom = atom<MasiveModeConfig>({
  signatures: {
    first: [],
    last: [],
  },
});

export const masiveModeConfigAtom = atom(
  (get) => get(masiveModeConfigPrimitiveAtom),
  (
    get,
    set,
    {
      page,
      index,
      key,
      value,
    }: {
      page: "first" | "last";
      index: number;
      key: SignatureConfigKeys;
      value: number;
    },
  ) => {
    const currentConfig = get(masiveModeConfigPrimitiveAtom);
    set(
      masiveModeConfigPrimitiveAtom,
      produce(currentConfig, (draft) => {
        draft.signatures[page][index].data[key] = value;
        draft.signatures[page][index].isConfigured = true;
      }),
    );
  },
);

export const isFirstPageConfigurationCompleteAtom = atom((get) => {
  const config = get(masiveModeConfigPrimitiveAtom);
  return config.signatures.first.every((sig) => sig.isConfigured);
});

export const isLastPageConfigurationCompleteAtom = atom((get) => {
  const config = get(masiveModeConfigPrimitiveAtom);
  return config.signatures.last.every((sig) => sig.isConfigured);
});

export const isConfigurationCompleteAtom = atom((get) => {
  const config = get(masiveModeConfigPrimitiveAtom);
  return (
    config.signatures.first.every((sig) => sig.isConfigured) &&
    config.signatures.last.every((sig) => sig.isConfigured)
  );
});

export const addSignatureToMasiveModeConfigAtom = atom(
  null,
  (
    get,
    set,
    {
      page,
      signature,
    }: {
      page: "first" | "last";
      signature: ISignature;
    },
  ) => {
    const currentConfig = get(masiveModeConfigPrimitiveAtom);
    set(
      masiveModeConfigPrimitiveAtom,
      produce(currentConfig, (draft) => {
        draft.signatures[page].push({
          isConfigured: false,
          data: initialConfigValues,
          signature,
        });
      }),
    );
  },
);
