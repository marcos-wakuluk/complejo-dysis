"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Container, TextInput, Button, Title, Select, Stack, Center } from "@mantine/core";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function CreateTicket() {
  const [userId, setUserId] = useState<string | null>(null);
  const [events, setEvents] = useState<{ _id: string; name: string; tandas: { date: string; price: number }[] }[]>([]);
  const [users, setUsers] = useState<{ _id: string; name: string; dni: string; lastname: string }[]>([]);
  const [event, setEvent] = useState<string | null>(null);
  const [dni, setDni] = useState("");
  const [userName, setUserName] = useState("");
  const [client, setClient] = useState("");
  const [tanda, setTanda] = useState<{ date: string; price: number } | null>(null);
  const [tandaIndex, setTandaIndex] = useState<number | null>(null);
  const router = useRouter();

  const fetchEvents = useCallback(async () => {
    const response = await fetch("/api/events?status=Activo");
    const data = await response.json();
    setEvents(data);
  }, []);

  const fetchUsers = useCallback(async () => {
    const response = await fetch("/api/users?role=usuario");
    const data = await response.json();
    setUsers(data);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded = jwtDecode<{ userId: string }>(token);
        setUserId(decoded?.userId);
      } else {
        router.push("/");
        return;
      }

      await fetchEvents();
      await fetchUsers();
    };
    fetchData();
  }, [router, fetchEvents, fetchUsers]);

  const handleDniChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const dni = event.currentTarget.value;
      setDni(dni);
      const user = users.find((user) => user.dni === dni);
      if (user) {
        setUserName(`${user.name} ${user.lastname}`);
        setClient(user._id);
      } else {
        setUserName("");
        setClient("");
      }
    },
    [users]
  );

  const handleEventChange = useCallback(
    (value: string | null) => {
      setEvent(value);
      const selectedEvent = events.find((e) => e._id === value);
      const today = new Date().toISOString().split("T")[0];
      let todayTanda = null;

      if (selectedEvent) {
        todayTanda = selectedEvent.tandas.find((t) => t.date.split("T")[0] === today) || null;

        if (!todayTanda) {
          const sortedTandas = [...selectedEvent.tandas].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          todayTanda = sortedTandas.find((t) => new Date(t.date).getTime() > new Date(today).getTime()) || null;
        }
      }

      setTanda(todayTanda);
      if (todayTanda) {
        const index = selectedEvent?.tandas.findIndex((t) => t.date === todayTanda.date);
        setTandaIndex(index !== undefined ? index + 1 : null);
      } else {
        setTandaIndex(null);
      }
    },
    [events]
  );

  const handleSubmit = useCallback(async () => {
    try {
      await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event, user: userId, client, tanda: tandaIndex, price: tanda?.price }),
      });
      setDni("");
      setUserName("");
      setClient("");
    } catch (error) {
      console.error(error);
    }
  }, [event, userId, client, tanda, tandaIndex]);

  const handleBack = useCallback(() => {
    router.push("/dashboard/promotor");
  }, [router]);

  const eventOptions = useMemo(() => events.map((event) => ({ value: event._id, label: event.name })), [events]);

  return (
    <Container>
      <Title order={2} mb="lg">
        Crear Ticket
      </Title>
      <Stack>
        <Select
          label="Evento"
          placeholder="Seleccione un evento"
          data={eventOptions}
          value={event}
          onChange={handleEventChange}
        />
        <Center mt="lg" display="flex" flex="space-between">
          <TextInput label="Tanda" value={tandaIndex ?? ""} readOnly mr={10} />
          <TextInput label="Precio" value={`$${tanda?.price ?? ""}`} readOnly />
        </Center>
        <TextInput label="DNI" placeholder="Ingrese su DNI" value={dni} onChange={handleDniChange} />
        <TextInput label="Nombre" placeholder="Nombre del usuario" value={userName} readOnly />
      </Stack>
      <Center mt="lg" display="flex" flex="space-between">
        <Button onClick={handleBack} variant="outline" fullWidth mr={10}>
          Atrás
        </Button>
        <Button onClick={handleSubmit} fullWidth disabled={!event || !dni || !userName}>
          Crear
        </Button>
      </Center>
    </Container>
  );
}
