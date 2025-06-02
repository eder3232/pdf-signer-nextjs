import { atom } from "jotai";

export interface ISignature {
  id: number;
  name: string;
  image: File;
}

const signaturesPrimitiveAtom = atom<ISignature[]>([]);

export const signaturesAtom = atom(
  (get) => get(signaturesPrimitiveAtom),
  (get, set, update: ISignature[]) => {
    const currentSignatures = get(signaturesPrimitiveAtom);
    set(signaturesPrimitiveAtom, [...currentSignatures, ...update]);
  },
);

const selectedSignaturePrimitiveAtom = atom<number | null>(null);

export const selectedSignatureAtom = atom(
  (get) => get(selectedSignaturePrimitiveAtom),
  (get, set, update: number) => {
    set(selectedSignaturePrimitiveAtom, update);
  },
);

export const addSignatureAtom = atom(
  null,
  (get, set, signature: ISignature) => {
    set(signaturesPrimitiveAtom, [...get(signaturesPrimitiveAtom), signature]);
  },
);

export const removeSignatureAtom = atom(
  null,
  (get, set, signatureId: number) => {
    const currentSignatures = get(signaturesPrimitiveAtom);
    const filteredSignatures = currentSignatures.filter(
      (sig) => sig.id !== signatureId,
    );
    set(signaturesPrimitiveAtom, filteredSignatures);

    // Ajustar el índice seleccionado si es necesario
    const selectedSignature = get(selectedSignaturePrimitiveAtom);
    if (
      selectedSignature !== null &&
      selectedSignature >= filteredSignatures.length
    ) {
      set(
        selectedSignaturePrimitiveAtom,
        Math.max(0, filteredSignatures.length - 1),
      );
    }
  },
);
