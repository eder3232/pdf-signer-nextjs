import { useDropzone } from 'react-dropzone'
import { useSetAtom } from 'jotai'
import { pdfAtom } from '@/app/store/pdf'
import { Card } from '@/components/ui/card'
import { Cloud, File } from 'lucide-react'

export default function InputPDF() {
  const setPdf = useSetAtom(pdfAtom)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        setPdf(acceptedFiles[0])
      }
    },
  })

  return (
    <Card
      {...getRootProps()}
      className={`p-6 border-dashed w-full border-2 cursor-pointer ${
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        {isDragActive ? (
          <>
            <Cloud className="h-10 w-10 text-blue-500 animate-bounce" />
            <p className="text-blue-500">Suelta el archivo PDF aquí</p>
          </>
        ) : (
          <>
            <File className="h-10 w-10 text-gray-400" />
            <p className="text-gray-500">
              Arrastra y suelta un archivo PDF aquí, o haz clic para seleccionar
            </p>
          </>
        )}
      </div>
    </Card>
  )
}
