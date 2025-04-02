"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { Card, Center, Grid, Title, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function MisComprasDetail() {
  const [tickets, setTickets] = useState<{ _id: string; event: { name: string }; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error("No token found");
        }

        const decoded = jwtDecode<{ userId: string }>(token);
        const userId = decoded.userId;

        const response = await fetch(`/api/tickets?userId=${userId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch tickets");
        }

        const data = await response.json();

        setTickets(data);
      } catch (error) {
        console.log(error);
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
    <div>
      <Title order={3} mb="md">
        Mis Compras
      </Title>
      <Grid>
        {tickets.map((ticket) => (
          <Grid.Col key={ticket._id}>
            <Card
              shadow="sm"
              padding="lg"
              onClick={() => router.push(`/dashboard/user/mis-compras/${ticket._id}`)}
              style={{ cursor: "pointer" }}
            >
              <Title order={4}>{ticket.event.name}</Title>
              <Text>Precio: ${ticket.price}</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
