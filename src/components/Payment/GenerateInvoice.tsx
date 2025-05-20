import React, { useState } from "react";
import axios from "axios";
import type { InvoiceProps } from "../../types";


const GenerateInvoice: React.FC<InvoiceProps> = ({
  sender,
  client,
  products,
  email,
  invoiceNumber,
  invoiceDate,
}) => {
  const [status, setStatus] = useState<string>("");

  const handleGenerateInvoice = async () => {
    setStatus("Generating invoice...");

    try {
      const response = await axios.post("https://invoice-mailer-one.vercel.app/generate-invoice", {
        sender,
        client,
        products,
        email,
        invoiceNumber,
        invoiceDate,
      });

      setStatus(response.data.message + " File: " + response.data.file);
    } catch (error) {
      console.error(error);
      setStatus("Failed to generate invoice.");
    }
  };

  return (
    <div className="p-4">
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleGenerateInvoice}
      >
        Generate Invoice
      </button>
      <p className="mt-2">{status}</p>
    </div>
  );
};

export default GenerateInvoice;
