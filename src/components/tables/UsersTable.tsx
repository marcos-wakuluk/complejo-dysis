"use client";

import { useEffect, useState } from "react";
import { Table, Button, Group, Badge, Select, Pagination, Flex, Text, Loader, Center } from "@mantine/core";
import { IconEdit, IconTrash, IconChevronDown, IconChevronUp, IconSelector, IconRefresh } from "@tabler/icons-react";
import { EditUserModal } from "../modals/EditUserModal";
import { DeleteUserModal } from "../modals/DeleteUserModal";
import { User } from "../../types/User";

export function UsersTable() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [opened, setOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const totalRecords = users.length;
  const totalPages = Math.ceil(totalRecords / parseInt(rowsPerPage));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedData = [...users].sort((a, b) => {
    if (!sortBy) return 0;

    const aValue = String(a[sortBy]).toLowerCase();
    const bValue = String(b[sortBy]).toLowerCase();

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const paginatedData = sortedData.slice((page - 1) * parseInt(rowsPerPage), page * parseInt(rowsPerPage));

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/users?id=${userToDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete._id));

      setDeleteModalOpened(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpened(true);
  };

  const handleSave = async (user: User) => {
    try {
      const response = await fetch(`/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      const updatedUser = await response.json();

      setUsers((prevUsers) => prevUsers.map((u) => (u._id === updatedUser._id ? updatedUser : u)));

      setOpened(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "red";
      case "promotor":
        return "blue";
      case "cajero":
        return "green";
      default:
        return "gray";
    }
  };

  const rows = paginatedData.map((user, index) => (
    <Table.Tr key={user.email}>
      <Table.Td>{(page - 1) * parseInt(rowsPerPage) + index + 1}</Table.Td>
      <Table.Td>{user.name}</Table.Td>
      <Table.Td>{user.lastname}</Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>{user.phone}</Table.Td>
      <Table.Td>
        <Badge color={getRoleColor(user.role)} variant="light">
          {user.role}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group>
          <Button size="xs" variant="outline" p={0} w={30} h={30} onClick={() => handleEdit(user)}>
            <IconEdit size="1rem" stroke={1.5} />
          </Button>
          <Button size="xs" color="red" variant="outline" p={0} w={30} h={30} onClick={() => handleDeleteClick(user)}>
            <IconTrash size="1rem" stroke={1.5} />
          </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  if (loading) {
    return (
      <Center style={{ height: "531px" }}>
        <Loader />
      </Center>
    );
  }

  return (
    <>
      <div style={{ maxHeight: "496px", overflow: "auto" }}>
        <Table striped stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th
                onClick={() => {
                  if (sortBy === "name") {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("name");
                    setSortDirection("asc");
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <Group>
                  <span>Nombre</span>
                  {sortBy === "name" ? (
                    sortDirection === "asc" ? (
                      <IconChevronUp size={14} />
                    ) : (
                      <IconChevronDown size={14} />
                    )
                  ) : (
                    <IconSelector size={14} />
                  )}
                </Group>
              </Table.Th>
              <Table.Th
                onClick={() => {
                  if (sortBy === "lastname") {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("lastname");
                    setSortDirection("asc");
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <Group>
                  <span>Apellido</span>
                  {sortBy === "lastname" ? (
                    sortDirection === "asc" ? (
                      <IconChevronUp size={14} />
                    ) : (
                      <IconChevronDown size={14} />
                    )
                  ) : (
                    <IconSelector size={14} />
                  )}
                </Group>
              </Table.Th>
              <Table.Th
                onClick={() => {
                  if (sortBy === "email") {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("email");
                    setSortDirection("asc");
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <Group justify="space-between">
                  <span>Email</span>
                  {sortBy === "email" ? (
                    sortDirection === "asc" ? (
                      <IconChevronUp size={14} />
                    ) : (
                      <IconChevronDown size={14} />
                    )
                  ) : (
                    <IconSelector size={14} />
                  )}
                </Group>
              </Table.Th>
              <Table.Th
                onClick={() => {
                  if (sortBy === "phone") {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("phone");
                    setSortDirection("asc");
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <Group>
                  <span>Telefono</span>
                  {sortBy === "phone" ? (
                    sortDirection === "asc" ? (
                      <IconChevronUp size={14} />
                    ) : (
                      <IconChevronDown size={14} />
                    )
                  ) : (
                    <IconSelector size={14} />
                  )}
                </Group>
              </Table.Th>
              <Table.Th
                onClick={() => {
                  if (sortBy === "role") {
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
                  } else {
                    setSortBy("role");
                    setSortDirection("asc");
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <Group>
                  <span>Rol</span>
                  {sortBy === "role" ? (
                    sortDirection === "asc" ? (
                      <IconChevronUp size={14} />
                    ) : (
                      <IconChevronDown size={14} />
                    )
                  ) : (
                    <IconSelector size={14} />
                  )}
                </Group>
              </Table.Th>
              <Table.Th>
                Acciones{" "}
                <Button size="xs" color="blue" variant="transparent" p={0} w={30} h={30} ml={15} onClick={() => {}}>
                  <IconRefresh size={15} stroke={1.5} onClick={() => {}} />
                </Button>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>

      <Flex justify="space-between" align="center" mt={10}>
        <Select
          value={rowsPerPage}
          onChange={(value) => {
            setRowsPerPage(value ?? "10");
            setPage(1);
          }}
          data={[
            { value: "10", label: "10 per page" },
            { value: "20", label: "20 per page" },
            { value: "50", label: "50 per page" },
            { value: "100", label: "100 per page" },
          ]}
          style={{ width: 130 }}
        />
        <Pagination value={page} onChange={setPage} total={totalPages} boundaries={1} siblings={1} />
        <Text size="sm" c="dimmed">
          Total: {totalRecords} users
        </Text>
      </Flex>

      <EditUserModal opened={opened} onClose={() => setOpened(false)} user={editingUser} onSave={handleSave} />

      <DeleteUserModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        user={userToDelete}
        onDelete={handleConfirmDelete}
      />
    </>
  );
}
