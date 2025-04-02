"use client";

import { Container, Center, Text } from "@mantine/core";
import { IconShoppingCart, IconCalendarEvent, IconQrcode } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import EventosDetail from "./eventos/page";

export default function Usuario() {
  const router = useRouter();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Container style={{ flex: 1, overflowY: "auto" }}>
        <EventosDetail />
      </Container>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "10px 0",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
          zIndex: 1000,
        }}
      >
        <Center
          style={{ cursor: "pointer", flexDirection: "column" }}
          onClick={() => router.push("/dashboard/user/mis-compras")}
        >
          <IconShoppingCart size={24} />
          <Text size="xs">Mis Compras</Text>
        </Center>
        <Center
          style={{ cursor: "pointer", flexDirection: "column" }}
          onClick={() => router.push("/dashboard/user/eventos")}
        >
          <IconCalendarEvent size={24} />
          <Text size="xs">Eventos</Text>
        </Center>
        <Center
          style={{ cursor: "pointer", flexDirection: "column" }}
          onClick={() => router.push("/dashboard/user/compra-con-qr")}
        >
          <IconQrcode size={24} />
          <Text size="xs">Compra con QR</Text>
        </Center>
      </div>
    </div>
  );
}
