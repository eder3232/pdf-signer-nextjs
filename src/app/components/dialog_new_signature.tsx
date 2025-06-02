'use client'

import { useDropzone } from 'react-dropzone'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Cloud, Loader2, Plus, Upload } from 'lucide-react'
import { addSignatureAtom, signaturesAtom } from '../store/signatures'
import { useAtom, useSetAtom } from 'jotai'

interface DialogNewSignatureProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  //   onUpload: (file: File, name: string) => Promise<void>
}

export default function DialogNewSignature({
  open,
  onOpenChange,
}: //   onUpload,
DialogNewSignatureProps) {
  const [newSignatureName, setNewSignatureName] = useState('')
  const [isUploadingSignature, setIsUploadingSignature] = useState(false)
  const [signatures, setSignatures] = useAtom(signaturesAtom)
  const addSignature = useSetAtom(addSignatureAtom)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[]) => {
      //   setFiles([...files, ...newFiles])

      if (acceptedFiles[0]) {
        setIsUploadingSignature(true)

        addSignature({
          id: signatures.length + 1,
          name: newSignatureName || acceptedFiles[0].name,
          image: acceptedFiles[0],
        })
        setIsUploadingSignature(false)
        onOpenChange(false)
        setNewSignatureName('')
      }
    },
  })

  const handleOpenChange = (open: boolean) => {
    // setFiles([])
    if (!open) {
      setNewSignatureName('')
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer transition-all hover:border-gray-400 hover:bg-gray-50 flex flex-col items-center justify-center min-h-[80px]">
          <Plus className="h-6 w-6 text-gray-400 mb-1" />
          <p className="text-xs text-gray-500 text-center">Agregar firma</p>
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
            <Label htmlFor="signature-file">Seleccionar archivo de firma</Label>
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
    </Dialog>
  )
}
