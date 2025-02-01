"use client";

import { useEffect, useState } from "react";
import { Table, Button, Group, Badge } from "@mantine/core";
import { EditEventModal } from "@/components/modals/EditEventModal";
import { DeleteEventModal } from "../modals/DeleteEventModal";
import { IconEdit, IconTrash, IconTicket } from "@tabler/icons-react";
import { Event } from "@/types/Event";
import { Loading } from "../Loading";

export function EventsTable() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const response = await fetch("/api/events");
    const data = await response.json();
    setEvents(data);
    setLoading(false);
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

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      await fetch("/api/events", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: selectedEvent._id }),
      });
      fetchEvents();
      setIsDeleteModalOpen(false);
    }
  };

  const rows = events.map((event) => (
    <Table.Tr key={`${event.name}-${event.date}`}>
      <Table.Td>{event.name}</Table.Td>
      <Table.Td>{event.description}</Table.Td>
      <Table.Td>
        {new Date(event.date).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })}
      </Table.Td>
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
            <IconEdit size={16} />
          </Button>
          <Button color="red" variant="outline" onClick={() => handleDeleteClick(event)}>
            <IconTrash size={16} />
          </Button>
          <Button size="xs" variant="outline" color="blue">
            <IconTicket size={16} />
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  if (loading) {
    return <Loading />;
  }

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

      {selectedEvent && (
        <DeleteEventModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          eventName={selectedEvent.name}
        />
      )}
    </>
  );
}
