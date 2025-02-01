"use client";

import { Table, Button, Badge } from "@mantine/core";
import { Sales } from "@/utils/constants";

export function SalesTable() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmada":
        return "green";
      case "pendiente":
        return "yellow";
      default:
        return "gray";
    }
  };

  const rows = Sales.map((sale, index) => (
    <Table.Tr key={`${sale.code}-${index}`}>
      <Table.Td>{sale.code}</Table.Td>
      <Table.Td>{new Date(sale["Fecha"]).toLocaleDateString()}</Table.Td>
      <Table.Td>{sale.total}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(sale.status)}>{sale.status}</Badge>
      </Table.Td>
      <Table.Td>{sale["Cajero"]}</Table.Td>
      <Table.Td>{sale["Metodo de Pago"]}</Table.Td>
      <Table.Td>{sale["Nro. Transacción"]}</Table.Td>
      <Table.Td>
        <Button size="xs" variant="outline" color={sale.status.toLowerCase() === "pendiente" ? "yellow" : "blue"}>
          {sale["Detalles"]}
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Sale Code</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th>Total</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Cashier</Table.Th>
          <Table.Th>Payment Method</Table.Th>
          <Table.Th>Transaction #</Table.Th>
          <Table.Th>Details</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
