"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { IconCheck } from "@tabler/icons-react";

interface ScannerProps {
  onScan: (decodedText: string) => void;
  onError: (error: Error) => void;
  event: { value: string; label: string };
}

export default function Scanner({ onScan, onError, event }: ScannerProps) {
  const [data, setData] = useState<string | null>("Sin resultado");
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const checkCameraPermission = async () => {
      const permission = localStorage.getItem("cameraPermission");
      if (permission === "granted") {
        startScanner();
      } else {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach((track) => track.stop());
          localStorage.setItem("cameraPermission", "granted");
          startScanner();
        } catch (error) {
          console.error("Camera permission denied", error);
          onError(new Error("Camera permission denied"));
        }
      }
    };

    const startScanner = () => {
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      const qrCodeSuccessCallback = (decodedText: string) => {
        setData(decodedText);
        onScan(decodedText);
        validateTicket(decodedText);
      };
      const qrCodeErrorCallback = () => {
        // No registrar el error en la consola
      };

      scannerRef.current = new Html5QrcodeScanner("reader", config, false);
      scannerRef.current.render(qrCodeSuccessCallback, qrCodeErrorCallback);
    };

    const validateTicket = async (decodedText: string) => {
      try {
        const ticketData = JSON.parse(decodedText);
        const { ticketId, eventId } = ticketData;

        if (!ticketId || !eventId) {
          setValidationMessage("QR inválido");
          setIsValid(false);
          return;
        }

        const response = await fetch(`/api/tickets/validate?ticketId=${ticketId}`);
        const data = await response.json();

        if (!response.ok) {
          setValidationMessage("Error validando el ticket");
          setIsValid(false);
          return;
        }

        if (data.used) {
          setValidationMessage("❌ Ticket ya utilizado");
          setIsValid(false);
          return;
        }

        if (data.event !== event.value) {
          setValidationMessage("❌ Ticket no corresponde a este evento");
          setIsValid(false);
          return;
        }

        setValidationMessage("✅ Ticket válido");
        setIsValid(true);
      } catch (error) {
        console.error("Error al validar el ticket:", error);
        setValidationMessage("Error al procesar el ticket");
        setIsValid(false);
      }
    };

    checkCameraPermission();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
      }
    };
  }, [onScan, onError, event.value]);

  return (
    <div style={{ padding: "20px", borderRadius: "8px", position: "relative" }}>
      <h2>Escanear Código QR</h2>
      <div id="reader" style={{ width: "100%" }}></div>
      <p>{data}</p>
      {validationMessage && <p>{validationMessage}</p>}
      {isValid && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 255, 0, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
          }}
        >
          <IconCheck size={50} />
          <span style={{ marginLeft: "10px" }}>Ticket válido</span>
        </div>
      )}
    </div>
  );
}
