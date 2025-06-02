import { useAtom } from "jotai";
import { masiveModeConfigAtom } from "../store/masiveModeConfig";
import PreviewPDF from "./preview-pdf";
import { pdfAtom, selectedPageAtom } from "../store/pdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RotateCcw, Upload, ZoomIn, ZoomOut } from "lucide-react";
import InputPDF from "./input-pdf";

const VisorPDF = () => {
  const [signatureConfig, setSignatureConfig] = useAtom(masiveModeConfigAtom);
  const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom);
  const [zoom, setZoom] = useState(100);
  const [pdfFile, setPdfFile] = useAtom(pdfAtom);
  return (
    <div className="space-y-4">
      <Card className="h-full">
        {/* <CardHeader className="flex flex-col space-y-4">PDF</CardHeader> */}
        <CardContent className="h-full space-y-4">
          {/* Input para cargar PDF */}
          <InputPDF />

          <div className="flex flex-row items-center justify-between gap-4 rounded-lg border-2 border-dashed border-gray-500 p-2">
            <CardTitle>
              Previsualización -{" "}
              {selectedPage === "first" ? "Primera hoja" : "Última hoja"}
            </CardTitle>
            <div className="flex items-center gap-2 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(50, zoom - 25))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="min-w-[60px] text-center text-sm font-medium">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoom(100)}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative h-[540px] w-full overflow-auto rounded-lg border border-gray-200 bg-white">
            {!pdfFile ? (
              <div className="flex h-full flex-col items-center justify-center text-gray-500">
                <Upload className="mb-4 h-12 w-12" />
                <p className="text-lg font-medium">No hay PDF cargado</p>
                <p className="text-sm">
                  Sube un archivo PDF para ver la previsualización
                </p>
              </div>
            ) : (
              <div
                className="relative flex h-full w-full items-center justify-center overflow-auto bg-blue-50"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                }}
              >
                {/* Contenido del PDF simulado */}
                <div className="relative h-[466px] w-[330px] bg-pink-500">
                  {/* <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="h-5 w-5 text-blue-600" />
        <span className="font-medium text-gray-700">
          {pdfFile.name}
        </span>
        <span className="text-sm text-gray-500">
          -{' '}
          {selectedPage === 'first'
            ? 'Página 1'
            : 'Última página'}
        </span>
      </div>
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6"></div>
      <div className="space-y-2 mt-8">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-gray-200 rounded w-full"
          ></div>
        ))}
      </div>
    </div> */}

                  <PreviewPDF />
                  {signatureConfig["signatures"][selectedPage].map(
                    (signature, index) => {
                      const currentConfig = signature.data;
                      // El ancho de una hoja A4 es de 21cm, si 330px = 21cm entonces:
                      // widthPx = (330px * widthCm) / 21cm
                      const widthPx = (330 * currentConfig.widthCm) / 21;
                      const heightPx = widthPx;
                      return (
                        <div
                          className="bg-opacity-50 absolute z-10 h-full rounded border-2 border-dashed border-blue-500"
                          style={{
                            left: `${currentConfig.positionX}%`,
                            top: `${currentConfig.positionY}%`,
                            width: `${widthPx}px`,
                            height: `${widthPx}px`, //la diferencia de altura que hay entre la caja y la firma esta causando un desfase hay que arreglar
                            opacity: currentConfig.opacity / 100,
                            /* 
        1. Primero desplazamos el 50% en X e Y: translate(-50%, -50%) 
        2. Luego rotamos: rotate(…)
        El orden importa: primero el translate para centrar el div, 
        luego la rotación sobre ese centro.
      */
                            transform: `translate(-50%, -50%) rotate(${currentConfig.rotation}deg)`,
                            transformOrigin:
                              "center center" /* por defecto ya está en centro, 
                                          pero se puede reforzar aquí */,
                          }}
                          key={index}
                        >
                          <img
                            src={URL.createObjectURL(signature.signature.image)}
                            alt="Firma"
                            className="h-full w-full object-contain p-1"
                          />
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisorPDF;
