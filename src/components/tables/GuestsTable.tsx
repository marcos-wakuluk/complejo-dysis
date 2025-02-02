"use client";

import { Table, Button, Group, Badge /* Avatar */, Pagination, Text, Flex, Select } from "@mantine/core";
import { IconEdit, IconTrash, IconCheck } from "@tabler/icons-react";
import LoadingAnimation from "../LoadingAnimation";
import { useEffect, useState } from "react";
import { Guest } from "@/types/Guest";

export function GuestsTable() {
  const [guest, setGuest] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalRecords = guest.length;

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/guests");
      const data = await response.json();
      setGuest(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (value: string | null) => {
    if (value !== null) {
      setRowsPerPage(parseInt(value, 10));
      setCurrentPage(1);
    }
  };

  const paginatedGuest = guest.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const rows = paginatedGuest.map((guest) => (
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

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <div style={{ maxHeight: "496px", overflow: "auto" }}>
        <Table striped highlightOnHover stickyHeader>
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
          total={Math.ceil(guest.length / rowsPerPage)}
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
