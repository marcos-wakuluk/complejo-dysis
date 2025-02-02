"use client";

import { Table, Button, Group, Badge /* Avatar */, Pagination, Text, Flex, Select } from "@mantine/core";
import { IconEdit, IconTrash, IconCheck } from "@tabler/icons-react";
import LoadingAnimation from "../LoadingAnimation";
import { useEffect, useState } from "react";
import { Guest } from "@/types/Guest";
import EditGuestModal from "../modals/EditGuestModal";
import DeleteGuestModal from "../modals/DeleteGuestModal";

export function GuestsTable() {
  const [guest, setGuest] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleEditClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (updatedGuest: Guest) => {
    setGuest((prevGuests) => prevGuests.map((guest) => (guest.dni === updatedGuest.dni ? updatedGuest : guest)));
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    setGuest((prevGuests) => prevGuests.filter((guest) => guest.dni !== selectedGuest!.dni));
    setIsDeleteModalOpen(false);
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
          <Button size="xs" variant="outline" onClick={() => handleEditClick(guest)}>
            <IconEdit size={16} />
          </Button>
          <Button color="red" variant="outline" onClick={() => handleDeleteClick(guest)}>
            <IconTrash size={16} />
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
              <Table.Th>#</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>DNI</Table.Th>
              <Table.Th>Edad</Table.Th>
              <Table.Th>Telefono</Table.Th>
              <Table.Th>Instagram</Table.Th>
              <Table.Th>Registrado</Table.Th>
              <Table.Th>Codigo de invitado</Table.Th>
              <Table.Th>Estado</Table.Th>
              <Table.Th>Acciones</Table.Th>
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
          Total: {totalRecords} invitados
        </Text>
      </Flex>

      {selectedGuest !== null && (
        <EditGuestModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          guest={selectedGuest}
          onSave={handleSave}
        />
      )}

      {selectedGuest && (
        <DeleteGuestModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
