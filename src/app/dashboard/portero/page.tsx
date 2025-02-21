"use client";

import { useState } from "react";
import { Card, Container, Modal, Text } from "@mantine/core";
import dynamic from "next/dynamic";

const Scanner = dynamic(() => import("@/components/Scanner"), { ssr: false });

export default function Portero() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleScan = (data: string | null) => {
    if (data) {
      setResult(data);
      setScanning(false);
    }
  };

  const handleError = (err: Error) => {
    console.error(err);
    setScanning(false);
  };

  return (
    <Container size="xl" style={{ padding: "20px" }}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ cursor: "pointer" }}
        onClick={() => setScanning(true)}
      >
        <Text size="lg" w={500}>
          Escanear
        </Text>
      </Card>
      <Modal opened={scanning} onClose={() => setScanning(false)} title="Escanear Código QR" size="lg">
        <Scanner onScan={handleScan} onError={handleError} />
      </Modal>
      {result && (
        <Text size="lg" w={500}>
          Resultado: {result}
        </Text>
      )}
    </Container>
  );
}
