"use client";

import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { FileText, Loader2 } from "lucide-react";
import { isConfigurationCompleteAtom } from "../store/masiveModeConfig";
import { pdfAtom } from "../store/pdf";
import { masiveModeConfigAtom } from "../store/masiveModeConfig";
import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";

export function BotonCreadorPDF() {
  const [isProcessing, setIsProcessing] = useState(false);
  const pdfFile = useAtomValue(pdfAtom);
  const config = useAtomValue(masiveModeConfigAtom);

  const handleCreatePDF = async () => {
    if (!pdfFile) {
      alert("Debes seleccionar un PDF primero");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Cargar el PDF original
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const totalPages = pages.length;

      // 2. Procesar firmas para páginas normales (todas excepto la última)
      for (let pageIndex = 0; pageIndex < totalPages - 1; pageIndex++) {
        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        // Procesar cada firma configurada para 'first'
        for (const signatureConfig of config.signatures.first) {
          if (!signatureConfig.isConfigured) continue;

          const imageBytes =
            await signatureConfig.signature.image.arrayBuffer();
          let image;

          if (signatureConfig.signature.image.type === "image/png") {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            image = await pdfDoc.embedJpg(imageBytes);
          }

          const { width: imgWidth, height: imgHeight } = image.scale(1);
          // Convertir cm a puntos (1 cm = 28.35 puntos en PDF)
          const targetWidthInPoints = signatureConfig.data.widthCm * 28.35;
          const scale = targetWidthInPoints / imgWidth;
          const finalHeight = imgHeight * scale;

          // Calcular posiciones basadas en porcentajes, invirtiendo el eje Y y ajustando por altura
          const xPos = width * (signatureConfig.data.positionX / 100);
          const yPos =
            height * (1 - signatureConfig.data.positionY / 100) - finalHeight;

          page.drawImage(image, {
            x: xPos + signatureConfig.data.randomX * Math.random(),
            y: yPos + signatureConfig.data.randomY * Math.random(),
            width: imgWidth * scale,
            height: imgHeight * scale,
            opacity: signatureConfig.data.opacity / 100,
            rotate: degrees(signatureConfig.data.rotation),
          });
        }
      }

      // 3. Procesar última página si existe
      if (totalPages > 0) {
        const lastPage = pages[totalPages - 1];
        const { width, height } = lastPage.getSize();
        const signaturesForLastPage =
          totalPages === 1 ? config.signatures.first : config.signatures.last;

        for (const signatureConfig of signaturesForLastPage) {
          if (!signatureConfig.isConfigured) continue;

          const imageBytes =
            await signatureConfig.signature.image.arrayBuffer();
          let image;

          if (signatureConfig.signature.image.type === "image/png") {
            image = await pdfDoc.embedPng(imageBytes);
          } else {
            image = await pdfDoc.embedJpg(imageBytes);
          }

          const { width: imgWidth, height: imgHeight } = image.scale(1);
          // Convertir cm a puntos (1 cm = 28.35 puntos en PDF)
          const targetWidthInPoints = signatureConfig.data.widthCm * 28.35;
          const scale = targetWidthInPoints / imgWidth;
          const finalHeight = imgHeight * scale;

          const xPos =
            (width * signatureConfig.data.positionX) / 100 -
            (imgWidth * scale) / 2;
          const yPos =
            (height * signatureConfig.data.positionY) / 100 -
            (imgHeight * scale) / 2 -
            finalHeight;

          lastPage.drawImage(image, {
            x: xPos + signatureConfig.data.randomX * Math.random(),
            y: yPos + signatureConfig.data.randomY * Math.random(),
            width: imgWidth * scale,
            height: imgHeight * scale,
            opacity: signatureConfig.data.opacity / 100,
            rotate: degrees(signatureConfig.data.rotation),
          });
        }
      }

      // 4. Guardar y descargar el PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documento_firmado.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al procesar el PDF:", error);
      alert("Ocurrió un error al procesar el PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleCreatePDF}
        disabled={isProcessing || !pdfFile}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Procesando...
          </>
        ) : (
          "Crear PDF con firmas"
        )}
      </Button>
    </div>
  );
}
