'use client'

import type React from 'react'

import { useState } from 'react'
import {
  Upload,
  FileText,
  ImageIcon,
  PenTool,
  Download,
  Loader2,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function PDFSignatureApp() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [signatureConfig, setSignatureConfig] = useState({
    x: 100,
    y: 100,
    width: 150,
    height: 50,
  })
  const [excludePages, setExcludePages] = useState('')

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setPdfFile(file)
    }
  }

  const handleSignatureUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'image/png') {
      setSignatureFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSignaturePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSignPDF = async () => {
    if (!pdfFile || !signatureFile) return

    setIsProcessing(true)
    // Simular procesamiento
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsProcessing(false)
    setIsComplete(true)
  }

  const handleDownload = () => {
    // Simular descarga
    const link = document.createElement('a')
    link.href = '#'
    link.download = `${pdfFile?.name?.replace('.pdf', '')}_firmado.pdf`
    link.click()
  }

  const resetApp = () => {
    setPdfFile(null)
    setSignatureFile(null)
    setSignaturePreview(null)
    setIsComplete(false)
    setExcludePages('')
    setSignatureConfig({ x: 100, y: 100, width: 150, height: 50 })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Firma Digital de Documentos PDF
          </h1>
          <p className="text-gray-600">
            Herramienta profesional para ingenieros civiles - Firma tus
            documentos técnicos de forma rápida y segura
          </p>
        </div>

        {!isComplete ? (
          <div className="space-y-6">
            {/* Sección de subida de archivos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Subir Archivos
                </CardTitle>
                <CardDescription>
                  Selecciona el documento PDF y tu imagen de firma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Dropzone PDF */}
                  <div className="space-y-3">
                    <Label htmlFor="pdf-upload" className="text-sm font-medium">
                      Documento PDF
                    </Label>
                    <div className="relative">
                      <input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          pdfFile
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {pdfFile
                            ? 'PDF cargado'
                            : 'Arrastra tu PDF aquí o haz clic para seleccionar'}
                        </p>
                      </div>
                    </div>
                    {pdfFile && (
                      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{pdfFile.name}</span>
                        <span className="text-xs">
                          ({(pdfFile.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Dropzone Firma */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="signature-upload"
                      className="text-sm font-medium"
                    >
                      Imagen de Firma (PNG)
                    </Label>
                    <div className="relative">
                      <input
                        id="signature-upload"
                        type="file"
                        accept=".png"
                        onChange={handleSignatureUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          signatureFile
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          {signatureFile
                            ? 'Firma cargada'
                            : 'Arrastra tu firma PNG aquí o haz clic para seleccionar'}
                        </p>
                      </div>
                    </div>
                    {signatureFile && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                          <ImageIcon className="h-4 w-4" />
                          <span className="truncate">{signatureFile.name}</span>
                        </div>
                        {signaturePreview && (
                          <div className="border rounded p-2 bg-white">
                            <p className="text-xs text-gray-500 mb-1">
                              Vista previa:
                            </p>
                            <img
                              src={signaturePreview || '/placeholder.svg'}
                              alt="Vista previa de firma"
                              className="max-h-16 max-w-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sección de configuración de firma */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Configuración de la Firma
                </CardTitle>
                <CardDescription>
                  Define la posición y tamaño de tu firma en el documento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pos-x">Posición X (puntos)</Label>
                    <Input
                      id="pos-x"
                      type="number"
                      value={signatureConfig.x}
                      onChange={(e) =>
                        setSignatureConfig((prev) => ({
                          ...prev,
                          x: Number(e.target.value),
                        }))
                      }
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pos-y">Posición Y (puntos)</Label>
                    <Input
                      id="pos-y"
                      type="number"
                      value={signatureConfig.y}
                      onChange={(e) =>
                        setSignatureConfig((prev) => ({
                          ...prev,
                          y: Number(e.target.value),
                        }))
                      }
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Ancho (puntos)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={signatureConfig.width}
                      onChange={(e) =>
                        setSignatureConfig((prev) => ({
                          ...prev,
                          width: Number(e.target.value),
                        }))
                      }
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Alto (puntos)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={signatureConfig.height}
                      onChange={(e) =>
                        setSignatureConfig((prev) => ({
                          ...prev,
                          height: Number(e.target.value),
                        }))
                      }
                      min="1"
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> Las coordenadas se miden desde la
                    esquina inferior izquierda de la página. 1 punto = 1/72
                    pulgadas (≈ 0.35 mm).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sección para excluir páginas */}
            <Card>
              <CardHeader>
                <CardTitle>Excluir Páginas (Opcional)</CardTitle>
                <CardDescription>
                  Especifica las páginas donde NO quieres que aparezca la firma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="exclude-pages">Páginas a excluir</Label>
                  <Input
                    id="exclude-pages"
                    placeholder="Ej: 1,3,5-7,10"
                    value={excludePages}
                    onChange={(e) => setExcludePages(e.target.value)}
                  />
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <strong>Formatos válidos:</strong>
                  </p>
                  <p>• Páginas individuales: 1,3,5</p>
                  <p>• Rangos: 5-7 (páginas 5, 6 y 7)</p>
                  <p>• Combinado: 1,3,5-7,10</p>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Botón principal */}
            <div className="text-center">
              <Button
                onClick={handleSignPDF}
                disabled={!pdfFile || !signatureFile || isProcessing}
                size="lg"
                className="px-8 py-3 text-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Procesando documento...
                  </>
                ) : (
                  <>
                    <PenTool className="mr-2 h-5 w-5" />
                    Firmar PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Sección de resultados */
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">
                ¡Documento Firmado Exitosamente!
              </CardTitle>
              <CardDescription>
                Tu PDF ha sido firmado y está listo para descargar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-gray-900">
                  Resumen de la operación:
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Documento original: {pdfFile?.name}</p>
                  <p>
                    • Firma aplicada en posición: X={signatureConfig.x}, Y=
                    {signatureConfig.y}
                  </p>
                  <p>
                    • Tamaño de firma: {signatureConfig.width} ×{' '}
                    {signatureConfig.height} puntos
                  </p>
                  {excludePages && <p>• Páginas excluidas: {excludePages}</p>}
                  <p>
                    • Tamaño del archivo final:{' '}
                    {pdfFile
                      ? ((pdfFile.size * 1.1) / 1024 / 1024).toFixed(1)
                      : '0'}{' '}
                    MB
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={handleDownload} size="lg" className="px-6">
                  <Download className="mr-2 h-5 w-5" />
                  Descargar PDF Firmado
                </Button>
                <Button
                  onClick={resetApp}
                  variant="outline"
                  size="lg"
                  className="px-6"
                >
                  Firmar Otro Documento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
