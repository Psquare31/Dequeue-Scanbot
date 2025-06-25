import React, { useState } from "react";
import axios from "axios";
import type{ SendInvoiceProps } from "../../types";
const SendInvoice: React.FC<SendInvoiceProps> = ({ orderId, amount, email, products }) => {
  const [status, setStatus] = useState<string>("");

  const sendInvoice = async () => {
    setStatus("Sending...");

    try {
      const response = await axios.post<{ message: string }>(
        // `${import.meta.env.VITE_MAIL_BACKEND_HOST_URL}/send-invoice`
        "https://invoice-mailer-one.vercel.app/send-invoice",
        // "http://localhost:3002/send-invoice",
        { orderId, amount, email, products }
      );

      setStatus(response.data.message);
    } catch (error) {
      setStatus("Failed to send invoice.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={sendInvoice}
      >
        Send Invoice
      </button>
      <p className="mt-2">{status}</p>
    </div>
  );
};

export default SendInvoice;