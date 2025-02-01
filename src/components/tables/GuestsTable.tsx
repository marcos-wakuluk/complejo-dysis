"use client";

import { Table, Button, Group, Badge /* Avatar */ } from "@mantine/core";
import { IconEdit, IconTrash, IconCheck } from "@tabler/icons-react";
import { Guests } from "@/utils/constants";

export function GuestsTable() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
        return "green";
      case "inactivo":
        return "red";
      case "pendiente":
        return "yellow";
      default:
        return "gray";
    }
  };

  const rows = Guests.map((guest) => (
    <Table.Tr key={guest.number}>
      <Table.Td>{guest.number}</Table.Td>
      <Table.Td>
        <Group>
          {/* <Avatar src={guest.photo} radius="xl" size="sm" /> */}
          {guest.name}
        </Group>
      </Table.Td>
      <Table.Td>{guest.dni}</Table.Td>
      <Table.Td>{guest.age}</Table.Td>
      <Table.Td>{guest.phone}</Table.Td>
      <Table.Td>
        <a href={`https://instagram.com/${guest.instagram}`} target="_blank" rel="noopener noreferrer">
          {guest.instagram}
        </a>
      </Table.Td>
      <Table.Td>{new Date(guest.date).toDateString()}</Table.Td>
      <Table.Td>{guest.guestCode}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(guest.status)}>{guest.status}</Badge>
      </Table.Td>
      <Table.Td>
        <Group>
          <Button size="xs" variant="outline">
            <IconEdit size="1rem" />
          </Button>
          <Button size="xs" variant="outline" color="red">
            <IconTrash size="1rem" />
          </Button>
          <Button size="xs" variant="outline" color="green">
            <IconCheck size="1rem" />
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Number</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Document</Table.Th>
          <Table.Th>Age</Table.Th>
          <Table.Th>Phone</Table.Th>
          <Table.Th>Instagram</Table.Th>
          <Table.Th>Registration Date</Table.Th>
          <Table.Th>Guest Code</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
