"use client";

import { useEffect, useState } from "react";
import { Table, Button, Group, Badge } from "@mantine/core";
import { IconEdit, IconAdjustments, IconTrash } from "@tabler/icons-react";
import { InventoryItem } from "@/types/InventoryItem";
import { Loading } from "@/components/Loading";
import { EditInventoryModal } from "@/components/modals/EditInventoryModal";
import { DeleteInventoryModal } from "@/components/modals/DeleteInventoryModal";

export function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
    }
  };

  const rows = inventory.map((item) => (
    <tr key={item.name}>
      <td>{item.name}</td>
      <td>{item.description ?? "-"}</td>
      <td style={{ textTransform: "capitalize" }}>{item.category}</td>
      <td>{item.quantity}</td>
      <td>{item.price}</td>
      <td>
        <Badge color={item.status === "activo" ? "green" : "red"}>{item.status}</Badge>
      </td>
      <td>
        <Group>
          <Button size="xs" variant="outline" onClick={() => handleEditClick(item)}>
            <IconEdit size={16} />
          </Button>
          <Button size="xs" variant="outline" color="yellow">
            <IconAdjustments size={16} />
          </Button>
          <Button size="xs" variant="outline" color="red" onClick={() => handleDeleteClick(item)}>
            <IconTrash size={16} />
          </Button>
        </Group>
      </td>
    </tr>
  ));

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      {selectedItem && (
        <EditInventoryModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          item={selectedItem}
        />
      )}

      {selectedItem && (
        <DeleteInventoryModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          itemName={selectedItem.name}
        />
      )}
    </>
  );
}
