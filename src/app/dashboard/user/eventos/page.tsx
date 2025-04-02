"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card, Center, Text, Stack, Image, Group, Badge, Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconMapPin } from "@tabler/icons-react";
import { formatDate } from "@/utils/utils";

export default function EventosDetail() {
  const [events, setEvents] = useState<
    {
      organizer: string;
      place: string;
      soldOut: boolean;
      image: string;
      _id: string;
      name: string;
      date: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(`/api/events`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch events");
        }

        const data = await response.json();

        setEvents(data);
      } catch (error) {
        console.log(error);
        setError((error as Error)?.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <Center>Loading...</Center>;
  }

  if (error) {
    return <Center>{error}</Center>;
  }

  return (
    <div>
      <Stack>
        {events.map((event) => (
          <Card
            key={event._id}
            shadow="sm"
            padding="lg"
            style={{ cursor: "pointer" }}
            onClick={() => router.push(`/dashboard/user/eventos/${event._id}`)}
          >
            {typeof event.image === "string" && (
              <Card.Section>
                <Image
                  src={typeof event.image === "string" ? event.image : "/placeholder-image.jpg"}
                  height={160}
                  alt="Norway"
                />
              </Card.Section>
            )}

            <Group justify="space-between" align="center" mt="xs">
              <Text>{formatDate(event.date)}</Text>
              {event.soldOut && <Badge color="red">Sold out</Badge>}
            </Group>

            <Group justify="space-between" mb="xs">
              <Text fw={500}>{event.name}</Text>
            </Group>

            <Group justify="space-between">
              <Text>{event.organizer || "Organizador"}</Text>
              <Text>
                <IconMapPin size={13} /> {event.place || "Lugar"}
              </Text>
            </Group>

            <Button
              color="blue"
              fullWidth
              mt="md"
              radius="md"
              onClick={() => router.push(`/dashboard/user/eventos/${event._id}`)}
            >
              Comprar
            </Button>
          </Card>
        ))}
      </Stack>
    </div>
  );
}
