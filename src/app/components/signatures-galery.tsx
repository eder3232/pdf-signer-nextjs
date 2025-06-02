'use client'

import { useDropzone } from 'react-dropzone'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, Cloud, Loader2, Plus, Upload } from 'lucide-react'
import {
  removeSignatureAtom,
  selectedSignatureAtom,
  signaturesAtom,
} from '../store/signatures'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useState } from 'react'
import DialogNewSignature from './dialog_new_signature'

export default function SignaturesGalery() {
  const signatures = useAtomValue(signaturesAtom)
  const [selectedSignature, setSelectedSignature] = useAtom(
    selectedSignatureAtom
  )
  const [newSignatureName, setNewSignatureName] = useState('')
  const [showAddSignatureDialog, setShowAddSignatureDialog] = useState(false)
  const [isUploadingSignature, setIsUploadingSignature] = useState(false)
  const removeSignature = useSetAtom(removeSignatureAtom)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setIsUploadingSignature(true)
        const formData = new FormData()
        formData.append('file', acceptedFiles[0])
        formData.append('name', newSignatureName || acceptedFiles[0].name)
      }
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Galería de Firmas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {signatures.map((signature, index) => (
            <div
              key={signature.id}
              className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                selectedSignature === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedSignature(index)}
            >
              <img
                src={URL.createObjectURL(signature.image) || '/placeholder.svg'}
                alt={signature.name}
                className="w-full h-12 object-contain"
              />
              <p className="text-xs text-center mt-2 text-gray-600 truncate">
                {signature.name}
              </p>
              {selectedSignature === index && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                  <Check className="h-3 w-3" />
                </div>
              )}
              {signature.id > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -left-2 h-6 w-6 p-0 bg-red-500 text-white rounded-full hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSignature(signature.id)
                  }}
                >
                  ×
                </Button>
              )}
            </div>
          ))}

          {/* Botón para agregar nueva firma */}
          {/* <Dialog
            open={showAddSignatureDialog}
            onOpenChange={setShowAddSignatureDialog}
          >
            <DialogTrigger asChild>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 flex flex-col items-center justify-center min-h-[80px]">
                <Plus className="h-6 w-6 text-gray-400 mb-1" />
                <p className="text-xs text-gray-500 text-center">
                  Agregar firma
                </p>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Firma</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signature-name">
                    Nombre de la firma (opcional)
                  </Label>
                  <Input
                    id="signature-name"
                    placeholder="Ej: Firma Principal, Iniciales..."
                    value={newSignatureName}
                    onChange={(e) => setNewSignatureName(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Si no especificas un nombre, se usará el nombre del archivo
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signature-file">
                    Seleccionar archivo de firma
                  </Label>
                  {}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all h-48
                       ${
                         isDragActive
                           ? 'border-blue-500 bg-blue-50'
                           : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                       }`}
                  >
                    <input
                      {...getInputProps()}
                      accept="image/png,image/jpeg,image/jpg"
                      disabled={isUploadingSignature}
                    />
                    <div className="flex flex-col items-center justify-center gap-2 h-full">
                      {isDragActive ? (
                        <>
                          <Cloud className="h-6 w-6 text-blue-500 animate-bounce" />
                          <p className="text-sm text-blue-500">
                            Suelta la imagen aquí
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-gray-400" />
                          <p className="text-sm text-gray-500 text-center">
                            Arrastra y suelta una imagen aquí, o haz clic para
                            seleccionar
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos soportados: PNG, JPG, JPEG
                  </p>
                </div>
                {isUploadingSignature && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Subiendo firma...</span>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog> */}

          <DialogNewSignature
            open={showAddSignatureDialog}
            onOpenChange={setShowAddSignatureDialog}
          />
        </div>
      </CardContent>
    </Card>
  )
}
