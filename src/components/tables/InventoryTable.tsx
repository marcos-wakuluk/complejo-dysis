"use client";

import { useEffect, useState } from "react";
import { Table, Button, Group, Badge, Select, Pagination, Text, Flex } from "@mantine/core";
import { IconEdit, IconAdjustments, IconTrash } from "@tabler/icons-react";
import { InventoryItem } from "@/types/InventoryItem";
import { EditInventoryModal } from "@/components/modals/EditInventoryModal";
import { DeleteInventoryModal } from "@/components/modals/DeleteInventoryModal";
import { EditStockModal } from "@/components/modals/EditStockModal";
import { Loading } from "../Loading";

export function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditStockModalOpen, setIsEditStockModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const fetchInventory = async () => {
    const response = await fetch("/api/inventory");
    const data = await response.json();
    setInventory(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedItem: InventoryItem) => {
    await fetch("/api/inventory", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    });
    fetchInventory();
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedItem) {
      await fetch("/api/inventory", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: selectedItem._id }),
      });
      fetchInventory();
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  const handleEditStockClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditStockModalOpen(true);
  };

  const handleSaveStock = async (updatedItem: InventoryItem) => {
    await fetch("/api/inventory", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    });
    fetchInventory();
    setIsEditStockModalOpen(false);
    setSelectedItem(null);
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

  const paginatedInventory = inventory.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const rows = paginatedInventory.map((item, index) => (
    <Table.Tr key={item.name}>
      <Table.Td>{(currentPage - 1) * rowsPerPage + index + 1}</Table.Td>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>{item.description ?? "-"}</Table.Td>
      <Table.Td style={{ textTransform: "capitalize" }}>{item.category}</Table.Td>
      <Table.Td>{item.quantity}</Table.Td>
      <Table.Td>{item.price}</Table.Td>
      <Table.Td>
        <Badge color={item.status === "activo" ? "green" : "red"}>{item.status}</Badge>
      </Table.Td>
      <Table.Td>
        <Group>
          <Button size="xs" variant="outline" onClick={() => handleEditClick(item)}>
            <IconEdit size={16} />
          </Button>
          <Button size="xs" variant="outline" color="yellow" onClick={() => handleEditStockClick(item)}>
            <IconAdjustments size={16} />
          </Button>
          <Button size="xs" variant="outline" color="red" onClick={() => handleDeleteClick(item)}>
            <IconTrash size={16} />
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const totalRecords = inventory.length;

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div style={{ maxHeight: "496px", overflow: "auto" }}>
        <Table striped highlightOnHover stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Nombre</Table.Th>
              <Table.Th>Descripción</Table.Th>
              <Table.Th>Categoría</Table.Th>
              <Table.Th>Cantidad</Table.Th>
              <Table.Th>Precio</Table.Th>
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
          total={Math.ceil(inventory.length / rowsPerPage)}
          value={currentPage}
          onChange={handlePageChange}
          style={{ marginTop: "1rem" }}
        />
        <Text size="sm" c="dimmed">
          Total: {totalRecords} items
        </Text>
      </Flex>

      {selectedItem && (
        <EditInventoryModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSave}
          item={selectedItem}
        />
      )}

      {selectedItem && (
        <DeleteInventoryModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedItem(null);
          }}
          onConfirm={handleDelete}
          itemName={selectedItem.name}
        />
      )}

      {selectedItem && (
        <EditStockModal
          isOpen={isEditStockModalOpen}
          onClose={() => {
            setIsEditStockModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveStock}
          item={selectedItem}
        />
      )}
    </>
  );
}
