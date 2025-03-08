"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Container, Card, Title, Text, Grid, Center } from "@mantine/core";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface Ticket {
  _id: string;
  event: {
    name: string;
  };
  price: number;
  qrCode: string;
  tanda: string;
}

export default function Usuario() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decoded = jwtDecode<{ userId: string }>(token);
        const userId = decoded.userId;

        const response = await fetch(`/api/users?id=${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tickets");
        }

        const data = await response.json();

        setTickets(data);
      } catch (error) {
        console.error(error);
        setError((error as Error)?.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <Center>Loading...</Center>;
  }

  if (error) {
    return <Center>{error}</Center>;
  }

  return (
    <Container>
      <Title order={2} mb="lg">
        Mis Tickets
      </Title>
      <Grid>
        {tickets.map((ticket) => (
          <Grid.Col key={ticket._id}>
            <Card shadow="sm" padding="lg">
              <Title order={4}>{ticket.event.name}</Title>
              <Text>Tanda: {ticket.tanda}</Text>
              <Text>Precio: ${ticket.price}</Text>
              <Image
                src={ticket.qrCode}
                alt="Código QR"
                layout="responsive"
                width={500}
                height={500}
                style={{ marginTop: "10px" }}
              />
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
