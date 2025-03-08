"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Container, Modal, Text, Select } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import dynamic from "next/dynamic";

const Scanner = dynamic(() => import("@/components/Scanner"), { ssr: false });

export default function Portero() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [events, setEvents] = useState<{ value: string; label: string }[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<{ value: string; label: string } | null>({ value: "", label: "" });

  const fetchEvents = useCallback(async () => {
    const response = await fetch("/api/events?status=Activo");
    const data = await response.json();

    setEvents(data.map((event: { _id: string; name: string }) => ({ value: event._id, label: event.name })));
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleScan = (data: string | null) => {
    if (data) {
      setScanning(false);
    }
  };

  const handleError = (err: Error) => {
    console.log(err);
    setScanning(false);
  };

  const handleEventChange = (eventValue: string | null) => {
    const event = events.find((e) => e.value === eventValue) || null;
    setSelectedEvent(event);
  };

  const handleValidation = (message: string, isValid: boolean) => {
    setResult(message);
    setIsValid(isValid);
    setShowResult(true);
    setTimeout(() => {
      setShowResult(false);
    }, 2000);
  };

  return (
    <Container size="xl" style={{ padding: "20px" }}>
      <Select
        label="Seleccionar Evento"
        placeholder="Elige un evento"
        data={events}
        value={selectedEvent?.value ?? "Cargando eventos..."}
        onChange={handleEventChange}
      />
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ cursor: selectedEvent ? "pointer" : "not-allowed", marginTop: "20px" }}
        onClick={() => selectedEvent && setScanning(true)}
      >
        <Text size="lg" w={500}>
          Escanear
        </Text>
      </Card>
      <Modal opened={scanning} onClose={() => setScanning(false)} title="Escanear Código QR" size="lg">
        {selectedEvent && (
          <Scanner onScan={handleScan} onError={handleError} onValidation={handleValidation} event={selectedEvent} />
        )}
      </Modal>
      {showResult && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: isValid ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
            zIndex: 1000,
          }}
        >
          {isValid ? <IconCheck size={50} /> : <IconX size={50} />}
          <span style={{ marginLeft: "10px" }}>{result}</span>
        </div>
      )}
    </Container>
  );
}
