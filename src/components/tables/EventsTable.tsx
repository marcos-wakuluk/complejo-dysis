"use client";

import { useState } from "react";
import { Table, Button, Group, Badge } from "@mantine/core";
import { Events } from "@/utils/constants";
import { EditEventModal } from "@/components/modals/EditEventModal";

export function EventsTable() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSave = (updatedEvent) => {
    // Aquí puedes agregar la lógica para guardar los cambios en la base de datos
    console.log("Evento actualizado:", updatedEvent);
    setIsModalOpen(false);
  };

  const rows = Events.map((event) => (
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
