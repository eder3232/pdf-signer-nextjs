"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { AlertTriangle, Check, ChevronDown, PenTool, Plus } from "lucide-react";
import { selectedPageAtom } from "../store/pdf";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  addSignatureToMasiveModeConfigAtom,
  isConfigurationCompleteAtom,
  isFirstPageConfigurationCompleteAtom,
  isLastPageConfigurationCompleteAtom,
  masiveModeConfigAtom,
} from "../store/masiveModeConfig";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { signaturesAtom } from "../store/signatures";

export default function Configuration() {
  const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom);
  const [signatureConfig, setSignatureConfig] = useAtom(masiveModeConfigAtom);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [signatures, setSignatures] = useAtom(signaturesAtom);
  const addSignatureToMasiveModeConfig = useSetAtom(
    addSignatureToMasiveModeConfigAtom,
  );

  const isConfigurationComplete = useAtomValue(isConfigurationCompleteAtom);

  const isFirstPageConfigurationComplete = useAtomValue(
    isFirstPageConfigurationCompleteAtom,
  );
  const isLastPageConfigurationComplete = useAtomValue(
    isLastPageConfigurationCompleteAtom,
  );
  return (
    <div className="space-y-4">
      {" "}
      {/* Selector de Hoja */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Seleccionar Hoja
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedPage}
            onValueChange={(value: "first" | "last") => setSelectedPage(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="first" id="first" />
              <Label htmlFor="first" className="flex items-center gap-2">
                Primera hoja
                {isFirstPageConfigurationComplete && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuración de Primera Hoja</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Configura la firma para la primera hoja.
                  </DialogDescription>
                  <div>
                    {signatures.map((signature) => (
                      <div
                        key={signature.id}
                        className="flex h-24 w-full items-center justify-between"
                      >
                        <img
                          src={URL.createObjectURL(signature.image)}
                          alt={signature.name}
                          className="h-full w-auto object-contain"
                        />
                        <p className="mt-2 truncate text-center text-xs text-gray-600">
                          {signature.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            addSignatureToMasiveModeConfig({
                              page: selectedPage,
                              signature: signature,
                            });
                          }}
                        >
                          <Plus className="h-8 w-8" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="last" id="last" />
              <Label htmlFor="last" className="flex items-center gap-2">
                Última hoja
                {isLastPageConfigurationComplete && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configuración de Primera Hoja</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Configura la firma para la primera hoja.
                  </DialogDescription>
                  <div>
                    {signatures.map((signature) => (
                      <div
                        key={signature.id}
                        className="flex h-24 w-full items-center justify-between"
                      >
                        <img
                          src={URL.createObjectURL(signature.image)}
                          alt={signature.name}
                          className="h-full w-auto object-contain"
                        />
                        <p className="mt-2 truncate text-center text-xs text-gray-600">
                          {signature.name}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            addSignatureToMasiveModeConfig({
                              page: selectedPage,
                              signature: signature,
                            });
                          }}
                        >
                          <Plus className="h-8 w-8" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      {signatureConfig["signatures"][selectedPage].map((signature, index) => (
        <div key={index} className="flex flex-col gap-4">
          {/* Controles de Posición */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Firma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">
                  Posición X:{" "}
                  {
                    signatureConfig["signatures"][selectedPage][index].data
                      .positionX
                  }{" "}
                  cm
                </Label>
                <Slider
                  value={[
                    signatureConfig["signatures"][selectedPage][index].data
                      .positionX,
                  ]}
                  onValueChange={(value) =>
                    setSignatureConfig({
                      key: "positionX",
                      index: index,
                      value: value[0],
                      page: selectedPage,
                    })
                  }
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Posición Y:{" "}
                  {
                    signatureConfig["signatures"][selectedPage][index].data
                      .positionY
                  }{" "}
                  cm
                </Label>
                <Slider
                  value={[
                    signatureConfig["signatures"][selectedPage][index].data
                      .positionY,
                  ]}
                  onValueChange={(value) =>
                    setSignatureConfig({
                      key: "positionY",
                      index: index,
                      value: value[0],
                      page: selectedPage,
                    })
                  }
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Ancho en cm:{" "}
                  {
                    signatureConfig["signatures"][selectedPage][index].data
                      .widthCm
                  }
                </Label>
                <Slider
                  value={[
                    signatureConfig["signatures"][selectedPage][index].data
                      .widthCm,
                  ]}
                  onValueChange={(value) =>
                    setSignatureConfig({
                      key: "widthCm",
                      index: index,
                      value: value[0],
                      page: selectedPage,
                    })
                  }
                  min={0}
                  max={10}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              {/* Configuración Avanzada */}
              <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-0"
                  >
                    <span className="font-medium">Configuración Avanzada</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        advancedOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div>
                    <Label className="text-sm font-medium">
                      Desviación aleatoria X: ±
                      {
                        signatureConfig["signatures"][selectedPage][index].data
                          .randomX
                      }{" "}
                      cm
                    </Label>
                    <Slider
                      value={[
                        signatureConfig["signatures"][selectedPage][index].data
                          .randomX,
                      ]}
                      onValueChange={(value) =>
                        setSignatureConfig({
                          key: "randomX",
                          index: index,
                          value: value[0],
                          page: selectedPage,
                        })
                      }
                      max={10}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Desviación aleatoria Y: ±
                      {
                        signatureConfig["signatures"][selectedPage][index].data
                          .randomY
                      }{" "}
                      cm
                    </Label>
                    <Slider
                      value={[
                        signatureConfig["signatures"][selectedPage][index].data
                          .randomY,
                      ]}
                      onValueChange={(value) =>
                        setSignatureConfig({
                          key: "randomY",
                          index: index,
                          value: value[0],
                          page: selectedPage,
                        })
                      }
                      max={10}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Rotación aleatoria: ±
                      {
                        signatureConfig["signatures"][selectedPage][index].data
                          .rotation
                      }
                      °
                    </Label>
                    <Slider
                      value={[
                        signatureConfig["signatures"][selectedPage][index].data
                          .rotation,
                      ]}
                      onValueChange={(value) =>
                        setSignatureConfig({
                          key: "rotation",
                          index: index,
                          value: value[0],
                          page: selectedPage,
                        })
                      }
                      max={15}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Opacidad:{" "}
                      {
                        signatureConfig["signatures"][selectedPage][index].data
                          .opacity
                      }
                      %
                    </Label>
                    <Slider
                      value={[
                        signatureConfig["signatures"][selectedPage][index].data
                          .opacity,
                      ]}
                      onValueChange={(value) =>
                        setSignatureConfig({
                          key: "opacity",
                          index: index,
                          value: value[0],
                          page: selectedPage,
                        })
                      }
                      min={10}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
          {/* Estado de Configuración */}
          {!isConfigurationComplete && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Falta configurar algunas hojas. Asegúrate de configurar tanto la
                primera como la última hoja.
              </AlertDescription>
            </Alert>
          )}
        </div>
      ))}
    </div>
  );
}
