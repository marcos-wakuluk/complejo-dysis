"use client";

import { Fragment, useEffect, useState } from "react";
import { Container, Table, Button, Collapse, Title } from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface Event {
  _id: string;
  name: string;
}

interface Ticket {
  _id: string;
  event: string;
  client: {
    lastname: string;
    name: string;
    dni: string;
  };
  price: number;
  createdAt: string;
}

export default function Ventas() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [openedEvent, setOpenedEvent] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded = jwtDecode<{ userId: string }>(token);
        setUserId(decoded?.userId);
      } else {
        router.push("/");
      }
    };

    const fetchEvents = async () => {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data);
    };

    const fetchTickets = async () => {
      const response = await fetch(`/api/tickets?userId=${userId}`);
      const data = await response.json();
      setTickets(data);
    };

    fetchEvents();
    fetchTickets();
    fetchData();
  }, [router, userId]);

  const handleToggle = (eventId: string) => {
    setOpenedEvent(openedEvent === eventId ? null : eventId);
  };

  const getTicketsForEvent = (eventId: string) => {
    return tickets.filter((ticket) => ticket.event === eventId);
  };

  return (
    <Container>
      <Title order={2} mb="lg">
        Ventas de Tickets
      </Title>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Evento</Table.Th>
            <Table.Th>Tickets vendidos</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {events.map((event, index) => (
            <Fragment key={index}>
              <Table.Tr>
                <Table.Td>{event.name}</Table.Td>
                <Table.Td>{tickets.filter((ticket) => ticket.event == event._id).length}</Table.Td>
                <Table.Td>
                  <Button
                    variant="subtle"
                    onClick={() => handleToggle(event._id)}
                    rightSection={openedEvent === event._id ? <IconChevronUp /> : <IconChevronDown />}
                  ></Button>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td colSpan={2}>
                  <Collapse in={openedEvent === event._id}>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Nombre del Usuario</Table.Th>
                          <Table.Th>Precio</Table.Th>
                          <Table.Th>Fecha</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {getTicketsForEvent(event._id).map((ticket) => (
                          <Table.Tr key={ticket._id}>
                            <Table.Td>
                              {ticket.client.name} {ticket.client.lastname}
                            </Table.Td>
                            <Table.Td>{ticket.price}</Table.Td>
                            <Table.Td>{new Date(ticket.createdAt).toLocaleDateString()}</Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Collapse>
                </Table.Td>
              </Table.Tr>
            </Fragment>
          ))}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
