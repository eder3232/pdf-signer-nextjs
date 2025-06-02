// MergeAndDownloadButton.tsx
import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { PDFDocument } from "pdf-lib";
import { pdfAtom } from "../store/pdf";
import { ISignature } from "../store/signatures";

interface Props {
  selectedSignature?: ISignature; // puede ser undefined si no hay firmas aún
}

export function MergeAndDownloadButton({ selectedSignature }: Props) {
  const pdfFile = useAtomValue(pdfAtom);
  const [isLoading, setIsLoading] = useState(false);

  const handleMergeAndDownload = async () => {
    if (!pdfFile) {
      alert("Debes seleccionar un PDF antes.");
      return;
    }

    if (!selectedSignature) {
      alert("No hay ninguna firma seleccionada.");
      return;
    }

    const imageFile = selectedSignature.image;
    if (!imageFile) {
      alert("La firma seleccionada no tiene archivo de imagen.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Leer ambos archivos como ArrayBuffer
      const [pdfBytes, imageBytes] = await Promise.all([
        pdfFile.arrayBuffer(),
        imageFile.arrayBuffer(),
      ]);

      // 2. Cargar el documento PDF existente
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // 3. Incrustar la imagen (PNG o JPG)
      let embeddedImage;
      if (imageFile.type === "image/png") {
        embeddedImage = await pdfDoc.embedPng(imageBytes);
      } else {
        embeddedImage = await pdfDoc.embedJpg(imageBytes);
      }

      // 4. Obtener dimensiones de la imagen para escalado
      const { width: imgW, height: imgH } = embeddedImage.scale(1);
      // Ejemplo: queremos que tenga 150pt de ancho
      const scaleFactor = 150 / imgW;
      const dibujadoAncho = imgW * scaleFactor;
      const dibujadoAlto = imgH * scaleFactor;

      // 5. Dibujar la imagen en cada página
      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        page.drawImage(embeddedImage, {
          x: 50,
          y: 50,
          width: dibujadoAncho,
          height: dibujadoAlto,
        });
      });

      // 6. Guardar el PDF modificado
      const modifiedPdfBytes = await pdfDoc.save();

      // 7. Crear un Blob y forzar la descarga
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documento_con_firma.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al procesar el PDF:", error);
      alert("Ocurrió un error al procesar el PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleMergeAndDownload}
      disabled={isLoading || !pdfFile || !selectedSignature}
      style={{
        padding: "8px 16px",
        backgroundColor:
          isLoading || !pdfFile || !selectedSignature ? "#ccc" : "#0070f3",
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor:
          isLoading || !pdfFile || !selectedSignature
            ? "not-allowed"
            : "pointer",
      }}
    >
      {isLoading ? "Procesando..." : "Insertar firma y descargar PDF"}
    </button>
  );
}
