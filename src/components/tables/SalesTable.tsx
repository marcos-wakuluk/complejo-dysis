"use client";

import { useEffect, useState } from "react";
import { Table, Button, Badge, Flex, Select, Pagination, Text } from "@mantine/core";
import { Sale } from "@/types/Sale";
import LoadingAnimation from "../LoadingAnimation";

export function SalesTable() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchSales = async () => {
    const response = await fetch("/api/sales");
    const data = await response.json();
    setSales(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

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

  const paginatedInventory = sales.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const rows = paginatedInventory.map((sale, index) => (
    <Table.Tr key={`${sale.code}-${index}`}>
      <Table.Td>{(currentPage - 1) * rowsPerPage + index + 1}</Table.Td>
      <Table.Td>{sale.code}</Table.Td>
      <Table.Td>{new Date(sale.date).toLocaleDateString()}</Table.Td>
      <Table.Td>{sale.total}</Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(sale.status)}>{sale.status}</Badge>
      </Table.Td>
      <Table.Td>{sale.cashier}</Table.Td>
      <Table.Td>{sale.paymentMethod}</Table.Td>
      <Table.Td>{sale.transactionNum}</Table.Td>
      <Table.Td>
        <Button size="xs" variant="outline" color={sale.status.toLowerCase() === "pendiente" ? "yellow" : "blue"}>
          {sale.details}
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: string | null) => {
    if (value !== null) {
      setRowsPerPage(parseInt(value, 10));
      setCurrentPage(1);
    }
  };

  const totalRecords = sales.length;

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <div style={{ maxHeight: "496px", overflow: "auto" }}>
        <Table striped highlightOnHover stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
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
      </div>
      <Flex justify="space-between" align="center" mt={10}>
        <Select
          label="Items por página"
          value={rowsPerPage.toString()}
          onChange={handleRowsPerPageChange}
          data={["5", "10", "20", "50"]}
          style={{ marginBottom: "1rem" }}
        />
        <Pagination
          total={Math.ceil(sales.length / rowsPerPage)}
          value={currentPage}
          onChange={handlePageChange}
          style={{ marginTop: "1rem" }}
        />
        <Text size="sm" c="dimmed">
          Total: {totalRecords} items
        </Text>
      </Flex>
    </>
  );
}
