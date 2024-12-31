import { SwissQRBill } from "swissqrbill/pdf";
import PDFDocument from "pdfkit";
import blobStream from "blob-stream";
import { showError, showProgress, uploadFileAsAttachment } from "./utils";

export const generateQRPDF = (
  paymentinfo,
  docname,
  frm,
  papersize,
  language
) => {
  const data = paymentinfo;
  try {
    const pdf = new PDFDocument({
      size: papersize || "A4",
      lang: language || "DE",
    });
    const qrbill = new SwissQRBill(data);

    showProgress(60, "generating pdf...");
    qrbill.attachTo(pdf);
    showProgress(80, "uploading pdf...");
    const stream = pdf.pipe(blobStream());
    pdf.end();
    stream.on("finish", () => {
      uploadFileAsAttachment(stream.toBlob("application/pdf"), docname, frm);
    });
  } catch (error) {
    showError(error);
  }
};
