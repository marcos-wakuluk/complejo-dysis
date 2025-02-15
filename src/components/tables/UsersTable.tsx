"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Table, Button, Group, Badge, Select, Pagination, Flex, Text, ScrollArea, Card, Input } from "@mantine/core";
import { IconEdit, IconTrash, IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import { EditUserModal } from "../modals/EditUserModal";
import { DeleteUserModal } from "../modals/DeleteUserModal";
import { User } from "../../types/User";
import { Loading } from "../Loading";
import { useMediaQuery } from "@mantine/hooks";

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
  const isMobile = useMediaQuery("(max-width: 600px)");

  const totalRecords = users.length;
  const totalPages = useMemo(() => Math.ceil(totalRecords / parseInt(rowsPerPage)), [totalRecords, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users?page=${page}&limit=${rowsPerPage}`);
      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

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

  const cards = paginatedData.map((user, index) => (
    <Card key={user.email} shadow="sm" padding="lg" radius="md" withBorder mt={10}>
      <Group justify="space-between">
        <Text>
          {(page - 1) * parseInt(rowsPerPage) + index + 1} - {user.name} {user.lastname}
        </Text>
        <Badge color={getRoleColor(user.role)} variant="light">
          {user.role}
        </Badge>
      </Group>
      <Text>{user.email}</Text>
      <Group justify="space-between">
        <Text>{user.phone}</Text>
        <Group>
          <Button size="xs" variant="outline" p={0} w={30} h={30} onClick={() => handleEdit(user)}>
            <IconEdit size="1rem" stroke={1.5} />
          </Button>
          <Button size="xs" color="red" variant="outline" p={0} w={30} h={30} onClick={() => handleDeleteClick(user)}>
            <IconTrash size="1rem" stroke={1.5} />
          </Button>
        </Group>
      </Group>
    </Card>
  ));

  if (loading) {
    return <Loading />;
  }

  const handleSort = (field: keyof User) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  return (
    <>
      <Input placeholder="Buscar" onChange={() => {}} />
      {isMobile ? (
        <>{cards}</>
      ) : (
        <div style={{ maxHeight: "496px", overflow: "auto" }}>
          <ScrollArea>
            <Table striped stickyHeader>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
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
                  <Table.Th onClick={() => handleSort("lastname")} style={{ cursor: "pointer" }}>
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
                  <Table.Th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                    <Group>
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
                  <Table.Th onClick={() => handleSort("phone")} style={{ cursor: "pointer" }}>
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
                  <Table.Th onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
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
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </div>
      )}
      <Flex
        direction={isMobile ? "column" : "row"}
        justify={isMobile ? "center" : "space-between"}
        align="center"
        mt={10}
        gap={isMobile ? "md" : 0}
      >
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
