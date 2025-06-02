import { useAtomValue, useSetAtom } from "jotai";
import { pdfAtom } from "@/app/store/pdf";
import { Document, Page, pdfjs, DocumentProps } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type OnDocumentLoadSuccess = Required<DocumentProps>["onLoadSuccess"];
type PDFDocProxy = Parameters<OnDocumentLoadSuccess>[0];

const PreviewPDF = () => {
  const pdf = useAtomValue(pdfAtom);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [width, setWidth] = useState(330);

  //   function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
  //     setNumPages(numPages)
  //     setPageNumber(1)
  //   }

  const onDocumentLoadSuccess = async (ederPage: PDFDocProxy) => {
    // If you want to get the dimension for page 1 (1-indexed)
    const page = await ederPage.getPage(1);
    const viewport = page.getViewport({ scale: 1.0 });
    console.log("Dimensiones del PDF:", {
      ancho: viewport.width,
      alto: viewport.height,
    });
    setNumPages(ederPage.numPages);
    setPageNumber(1);
  };
  return (
    <div className="">
      {pdf ? (
        <Document
          file={pdf}
          onLoadSuccess={(e) => onDocumentLoadSuccess(e)}
          loading={<p className="text-center">Cargando PDF…</p>}
          noData={
            <p className="text-center text-red-500">No hay datos de PDF</p>
          }
          error={
            <p className="text-center text-red-500">Error al cargar PDF</p>
          }
        >
          <div className="flex w-full flex-row items-center justify-center">
            <div className="inline-block border-2 border-red-500">
              <Page
                pageNumber={pageNumber}
                width={width}
                loading={<p className="text-center">Cargando página…</p>}
              />
            </div>
          </div>
        </Document>
      ) : (
        <p className="text-center text-gray-500">Esperando PDF…</p>
      )}
    </div>
  );
};

export default PreviewPDF;
