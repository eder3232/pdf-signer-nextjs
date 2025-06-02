"use client";
import { useDropzone } from "react-dropzone";

import type React from "react";

import { useAtom, useAtomValue } from "jotai";
import { pdfAtom, selectedPageAtom } from "./store/pdf";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  PenTool,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  AlertTriangle,
  Check,
  User,
  Plus,
  Upload,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import InputPDF from "./components/input-pdf";
import PreviewPDF from "./components/preview-pdf";
import SignaturesGalery from "./components/signatures-galery";
import { MergeAndDownloadButton } from "./components/pruebas";
import { signaturesAtom } from "./store/signatures";
import Configuration from "./components/configuration";
import VisorPDF from "./components/visorPDF";
import { BotonCreadorPDF } from "./components/boton-creador-pdf";

export default function PDFSignerApp() {
  const [selectedPage, setSelectedPage] = useAtom(selectedPageAtom);
  const [selectedSignature, setSelectedSignature] = useState<number>(0);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [zoom, setZoom] = useState(100);

  const signatures2 = useAtomValue(signaturesAtom);

  // Configuración de firmas por página
  const [signatureConfig, setSignatureConfig] = useState({
    first: {
      configured: false,
      positionX: [50],
      positionY: [50],
      scale: [100],
      randomX: [0],
      randomY: [0],
      rotation: [0],
      opacity: [100],
    },
    last: {
      configured: true,
      positionX: [75],
      positionY: [25],
      scale: [80],
      randomX: [5],
      randomY: [5],
      rotation: [2],
      opacity: [90],
    },
  });

  const [signatures, setSignatures] = useState([
    {
      id: 1,
      name: "Firma Principal",
      url: "/placeholder.svg?height=60&width=120",
    },
    {
      id: 2,
      name: "Firma Alternativa",
      url: "/placeholder.svg?height=60&width=120",
    },
    { id: 3, name: "Iniciales", url: "/placeholder.svg?height=60&width=120" },
  ]);
  const [pdfFile, setPdfFile] = useAtom(pdfAtom);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isUploadingSignature, setIsUploadingSignature] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [newSignatureName, setNewSignatureName] = useState("");
  const [showAddSignatureDialog, setShowAddSignatureDialog] = useState(false);

  const currentConfig = signatureConfig[selectedPage];
  const isConfigurationComplete =
    signatureConfig.first.configured && signatureConfig.last.configured;

  const updateConfig = (key: string, value: number[]) => {
    setSignatureConfig((prev) => ({
      ...prev,
      [selectedPage]: {
        ...prev[selectedPage],
        [key]: value,
        configured: true,
      },
    }));
  };

  const handleSignatureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingSignature(true);

    try {
      // Simular carga de archivo
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const url = URL.createObjectURL(file);
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const signatureName = newSignatureName.trim() || fileName;

      const newSignature = {
        id: Date.now(),
        name: signatureName,
        url: url,
      };

      setSignatures((prev) => [...prev, newSignature]);
      setNewSignatureName("");
      setShowAddSignatureDialog(false);
    } catch (error) {
      console.error("Error uploading signature:", error);
    } finally {
      setIsUploadingSignature(false);
    }
  };

  const removeSignature = (id: number) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id));
    if (selectedSignature >= signatures.length - 1) {
      setSelectedSignature(Math.max(0, signatures.length - 2));
    }
  };

  /// raaa
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [] },
    multiple: false,
    // onDrop: onFilesAccepted,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-3 py-4">
        <div className="max-w-items-center mx-auto flex justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">PDFSigner</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <User className="mr-2 h-4 w-4" />
              Usuario
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid h-[calc(100vh-120px)] grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Panel de Configuración */}
          <div className="space-y-6 overflow-y-auto">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                PDFSigner
              </h2>
              <p className="text-lg text-gray-600">
                Modo Masivo - Configura las firmas para tu documento
              </p>
            </div>

            {/* Galería de Firmas */}

            <SignaturesGalery />

            <Configuration />

            {/* Botón Principal */}
            {/* <Button
              className="h-12 w-full text-lg"
              disabled={!isConfigurationComplete}
            >
              <FileText className="mr-2 h-5 w-5" />
              Generar PDF firmado
            </Button> */}
            <BotonCreadorPDF />
          </div>

          {/* Visor de PDF */}
          <VisorPDF />
        </div>
      </div>
      {/* <div>
        {signatures2.length > 0 && (
          <MergeAndDownloadButton selectedSignature={signatures2[0]} />
        )}
      </div> */}
    </div>
  );
}
