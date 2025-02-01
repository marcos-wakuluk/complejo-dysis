"use client";

import { useEffect, useState } from "react";
import { Table, Button, Group, Badge } from "@mantine/core";
import { EditEventModal } from "@/components/modals/EditEventModal";

interface Event {
  name: string;
  description: string;
  date: string;
  startTime: string;
  numberOfPeople: number;
  peopleEntered: number;
  ticketsSold: number;
  status: string;
}

export function EventsTable() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const response = await fetch("/api/events");
    const data = await response.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Activo":
        return "green";
      case "Suspendido":
        return "red";
      case "Finalizado":
        return "gray";
      default:
        return "blue";
    }
  };

  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedEvent: Event) => {
    await fetch("/api/events", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    });

    setIsModalOpen(false);
  };

  const rows = events.map((event) => (
    <Table.Tr key={`${event.name}-${event.date}`}>
      <Table.Td>{event.name}</Table.Td>
      <Table.Td>{event.description}</Table.Td>
      <Table.Td>{new Date(event.date).toLocaleDateString()}</Table.Td>
      <Table.Td>{event.startTime}</Table.Td>
      <Table.Td>{event.numberOfPeople}</Table.Td>
      <Table.Td>{event.peopleEntered}</Table.Td>
      <Table.Td>{event.ticketsSold}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(event.status)}>{event.status}</Badge>
      </Table.Td>
      <Table.Td>
        <Group>
          <Button size="xs" variant="outline" onClick={() => handleEditClick(event)}>
            Edit
          </Button>
          <Button size="xs" variant="outline" color="blue">
            View Tickets
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Descripcion</Table.Th>
            <Table.Th>Fecha</Table.Th>
            <Table.Th>Inicio</Table.Th>
            <Table.Th>Capacidad</Table.Th>
            <Table.Th>Entered</Table.Th>
            <Table.Th>Entradas Vendidas</Table.Th>
            <Table.Th>Estado</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
