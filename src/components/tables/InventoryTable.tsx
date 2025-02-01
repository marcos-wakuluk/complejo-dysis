"use client";

import { Table, Button, Group, Badge } from "@mantine/core";
import { Inventory } from "@/utils/constants";

export function InventoryTable() {
  const rows = Inventory.map((item) => (
    <Table.Tr key={item.name}>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>{item.description || "-"}</Table.Td>
      <Table.Td style={{ textTransform: "capitalize" }}>{item.category}</Table.Td>
      <Table.Td>{item.quantity}</Table.Td>
      <Table.Td>{item.price}</Table.Td>
      <Table.Td>
        <Badge color={item.status === "activo" ? "green" : "red"}>{item.status}</Badge>
      </Table.Td>
      <Table.Td>
        <Group>
          <Button size="xs" variant="outline">
            Edit
          </Button>
          <Button size="xs" variant="outline" color="yellow">
            Modify Stock
          </Button>
          <Button size="xs" variant="outline" color="red">
            Delete
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Nombre</Table.Th>
          <Table.Th>Descripcion</Table.Th>
          <Table.Th>Categoria</Table.Th>
          <Table.Th>Cantidad</Table.Th>
          <Table.Th>Precio</Table.Th>
          <Table.Th>Esstado</Table.Th>
          <Table.Th>Acciones</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
