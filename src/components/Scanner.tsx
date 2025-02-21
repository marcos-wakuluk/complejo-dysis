"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { IconCheck } from "@tabler/icons-react";

interface ScannerProps {
  onScan: (decodedText: string) => void;
  onError: (error: Error) => void;
}

export default function Scanner({ onScan, onError }: ScannerProps) {
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
      const qrCodeErrorCallback = (errorMessage: string) => {
        console.error(errorMessage);
      };

      scannerRef.current = new Html5QrcodeScanner("reader", config, false);
      scannerRef.current.render(qrCodeSuccessCallback, qrCodeErrorCallback);
    };

    const validateTicket = (decodedText: string) => {
      console.log("🚀 ~ validateTicket ~ decodedText:", decodedText);
      // Aquí puedes agregar la lógica para validar el ticket
      // Por ejemplo, puedes hacer una llamada a una API para verificar si el ticket es válido
      const isValid = true; // Reemplaza esto con la lógica real de validación

      if (isValid) {
        setValidationMessage("Ticket válido");
        setIsValid(true);
      } else {
        setValidationMessage("Ticket inválido");
        setIsValid(false);
      }

      // Mantener el escáner abierto
    };

    checkCameraPermission();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
      }
    };
  }, [onScan, onError]);

  return (
    <div style={{ padding: "20px", borderRadius: "8px" }}>
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
