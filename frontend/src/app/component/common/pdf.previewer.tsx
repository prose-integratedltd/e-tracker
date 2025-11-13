"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.mjs`;

const PdfPreviewer = ({ file: { url } }: { file: { url: string } }) => {
	const [pageCount, setPageCount] = useState(0);

	return (
		<div className="mt-4 border p-2">
			<Document
				file={url}
				onLoadSuccess={({ numPages }) => setPageCount(numPages)}
			>
				{Array.from(new Array(pageCount), (_, index) => (
					<Page key={index} pageNumber={index + 1} width={600} />
				))}
			</Document>
		</div>
	);
};

export default PdfPreviewer;
