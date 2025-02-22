"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Container, Modal, Text, Select } from "@mantine/core";
import dynamic from "next/dynamic";

const Scanner = dynamic(() => import("@/components/Scanner"), { ssr: false });

export default function Portero() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
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
      setResult(data);
      setScanning(false);
    }
  };

  const handleError = (err: Error) => {
    console.error(err);
    setScanning(false);
  };

  const handleEventChange = (eventValue: string | null) => {
    const event = events.find((e) => e.value === eventValue) || null;
    setSelectedEvent(event);
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
        {selectedEvent && <Scanner onScan={handleScan} onError={handleError} event={selectedEvent} />}
      </Modal>
      {result && (
        <Text size="lg" w={500}>
          Resultado: {result}
        </Text>
      )}
    </Container>
  );
}
