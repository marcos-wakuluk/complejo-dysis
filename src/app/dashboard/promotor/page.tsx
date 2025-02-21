"use client";

import { Container, Card, SimpleGrid, Text, Title } from "@mantine/core";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type DecodedToken = {
  name: string;
};

export default function PromotorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);

  const handleCreateTicket = () => {
    router.push("/dashboard/promotor/ticket");
  };

  const handleViewTickets = () => {
    router.push("/dashboard/promotor/ventas");
  };

  const handleCompetencia = () => {
    router.push("/dashboard/promotor/competencia");
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <Container size="xl" style={{ padding: "20px" }}>
      <Title order={2} mb="lg">
        Hola {user?.name}!
      </Title>
      <SimpleGrid cols={2} spacing="lg">
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          onClick={handleCreateTicket}
          style={{ cursor: "pointer" }}
        >
          <Text size="lg" w={500}>
            Crear Ticket
          </Text>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder onClick={handleViewTickets} style={{ cursor: "pointer" }}>
          <Text size="lg" w={500}>
            Ver Tickets
          </Text>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder onClick={handleCompetencia} style={{ cursor: "pointer" }}>
          <Text size="lg" w={500}>
            Competencia
          </Text>
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text size="lg" w={500}>
            Otros
          </Text>
        </Card>
      </SimpleGrid>
    </Container>
  );
}
