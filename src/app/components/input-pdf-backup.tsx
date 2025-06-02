import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { pdfAtom } from '../store/pdf'
import { useAtom } from 'jotai'
import { Check, Loader2 } from 'lucide-react'
import { useState } from 'react'

const InputPDF = () => {
  const [pdfFile, setPdfFile] = useAtom(pdfAtom)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const handlePdfUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploadingPdf(true)

    try {
      // Simular carga de PDF
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setPdfFile(file)
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
    } catch (error) {
      console.error('Error uploading PDF:', error)
    } finally {
      setIsUploadingPdf(false)
    }
  }
  return (
    <div className="space-y-2">
      <Label htmlFor="pdf-file">Cargar documento PDF</Label>
      <div className="flex items-center gap-2">
        <Input
          id="pdf-file"
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          disabled={isUploadingPdf}
          className="flex-1"
        />
        {pdfFile && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <Check className="h-4 w-4" />
            {pdfFile.name}
          </span>
        )}
      </div>
      {isUploadingPdf && (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Cargando PDF...</span>
        </div>
      )}
    </div>
  )
}

export default InputPDF
