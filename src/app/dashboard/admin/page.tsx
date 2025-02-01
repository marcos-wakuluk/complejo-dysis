"use client";

import { useState } from "react";
import { Container, Tabs, Title } from "@mantine/core";
import { IconUsers, IconCalendarEvent, IconTicket, IconBox, IconCash } from "@tabler/icons-react";
import { UsersTable } from "@/components/tables/UsersTable";
import { EventsTable } from "@/components/tables/EventsTable";
import { GuestsTable } from "@/components/tables/GuestsTable";
import { InventoryTable } from "@/components/tables/InventoryTable";
import { SalesTable } from "@/components/tables/SalesTable";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string | null>("users");

  return (
    <Container size="xl">
      <Title order={2} mb="xl">
        Panel de Administrador
      </Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="users" leftSection={<IconUsers size="1rem" />}>
            Usuarios
          </Tabs.Tab>
          <Tabs.Tab value="events" leftSection={<IconCalendarEvent size="1rem" />}>
            Eventos
          </Tabs.Tab>
          <Tabs.Tab value="guests" leftSection={<IconTicket size="1rem" />}>
            Invitados
          </Tabs.Tab>
          <Tabs.Tab value="inventory" leftSection={<IconBox size="1rem" />}>
            Inventario
          </Tabs.Tab>
          <Tabs.Tab value="sales" leftSection={<IconCash size="1rem" />}>
            Ventas
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="users" pt="xl">
          {activeTab === "users" && <UsersTable />}
        </Tabs.Panel>

        <Tabs.Panel value="events" pt="xl">
          {activeTab === "events" && <EventsTable />}
        </Tabs.Panel>

        <Tabs.Panel value="guests" pt="xl">
          {activeTab === "guests" && <GuestsTable />}
        </Tabs.Panel>

        <Tabs.Panel value="inventory" pt="xl">
          {activeTab === "inventory" && <InventoryTable />}
        </Tabs.Panel>

        <Tabs.Panel value="sales" pt="xl">
          {activeTab === "sales" && <SalesTable />}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
