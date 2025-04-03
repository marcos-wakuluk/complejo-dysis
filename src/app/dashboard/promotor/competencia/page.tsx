"use client";

import { ReactNode, useEffect, useState } from "react";
import { Card, Container, SimpleGrid, Text, Button, Collapse, Table, Center } from "@mantine/core";

interface Ticket {
  user: ReactNode;
  cantidad: number;
}

interface Evento {
  _id: string;
  name: ReactNode;
  id: number;
  tickets: Ticket[];
}

interface User {
  name: string;
  lastname: string;
  _id: string;
}

export default function Competencia() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [ticketsPorEvento, setTicketsPorEvento] = useState<Ticket[]>([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      const response = await fetch(`/api/events`);

      if (!response.ok) {
        throw new Error("Failed to fetch eventos");
      }
      const data = await response.json();
      setEvents(data);
    };

    fetchEventos();
  }, []);

  const handleEventoClick = async (eventoId: string) => {
    handleToggle(eventoId);
    setLoading(true);
    try {
      const response = await fetch(`/api/tickets?eventId=${eventoId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const ticketsData: Ticket[] = await response.json();

      const responseUsers = await fetch(`/api/users?role=promotor`);
      if (!responseUsers.ok) {
        throw new Error("Failed to fetch users");
      }

      const users: User[] = await responseUsers.json();
      const userMap = users.reduce((acc, { _id, name, lastname }) => {
        acc[_id] = `${name} ${lastname}`;
        return acc;
      }, {} as Record<string, string>);

      const ticketsAgrupados = ticketsData.reduce((acc, { user }) => {
        const userKey = String(user);
        if (!acc[userKey]) {
          acc[userKey] = { user: userMap[userKey] || "Desconocido", cantidad: 0 };
        }
        acc[userKey].cantidad += 1;
        return acc;
      }, {} as Record<string, { user: string; cantidad: number }>);

      const ticketsPorVendedor = Object.values(ticketsAgrupados).sort((a, b) => b.cantidad - a.cantidad);

      setTicketsPorEvento(ticketsPorVendedor);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (eventId: string) => {
    setEventoSeleccionado(eventoSeleccionado === eventId ? null : eventId);
  };

  return (
    <Container size="xl" style={{ padding: "20px" }}>
      <SimpleGrid cols={1} spacing="lg">
        {events.map((event) => (
          <div key={event._id}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Text size="lg">{event.name}</Text>
              <Button mt="sm" onClick={() => handleEventoClick(event._id)}>
                {eventoSeleccionado === event._id ? "Ocultar Tickets" : "Ver Tickets Vendidos"}
              </Button>
            </Card>
            <Collapse in={eventoSeleccionado === event._id}>
              {loading && <Text>Loading...</Text>}
              {!loading && ticketsPorEvento.length === 0 && <Text>No hay tickets vendidos</Text>}
              {!loading && ticketsPorEvento.length > 0 && (
                <Table mt="sm" highlightOnHover striped withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Promotor</Table.Th>
                      <Table.Th>Vendidos</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {ticketsPorEvento?.map((ticket, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{ticket.user}</Table.Td>
                        <Table.Td>
                          <Center>{ticket.cantidad}</Center>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </Collapse>
          </div>
        ))}
      </SimpleGrid>
    </Container>
  );
}
