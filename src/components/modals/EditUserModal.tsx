import { useEffect, useState } from "react";
import { Modal, TextInput, PasswordInput, Button, Group, Select } from "@mantine/core";
import { User } from "../../types/User";
import { roles } from "../../constants";

interface EditUserModalProps {
  readonly opened: boolean;
  readonly onClose: () => void;
  readonly user: User | null;
  readonly onSave: (user: User) => void;
}

export function EditUserModal({ opened, onClose, user, onSave }: EditUserModalProps) {
  const [editingUser, setEditingUser] = useState<User | null>(user);

  useEffect(() => {
    setEditingUser(user);
  }, [user]);

  const handleSave = () => {
    if (editingUser) {
      onSave(editingUser);
    }
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Editar" centered>
      {editingUser && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <TextInput
            label="Nombre"
            value={editingUser.name || ""}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            mb="md"
          />
          <TextInput
            label="Apellido"
            value={editingUser.lastname || ""}
            onChange={(e) => setEditingUser({ ...editingUser, lastname: e.target.value })}
            mb="md"
          />
          <TextInput
            label="Email"
            value={editingUser.email || ""}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            mb="md"
          />
          <PasswordInput
            label="Contraseña"
            value={editingUser.password || ""}
            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
            mb="md"
          />
          <TextInput
            label="Telefono"
            value={editingUser.phone || ""}
            onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
            mb="md"
          />
          <Select
            label="Rol"
            name="role"
            data={roles}
            value={editingUser.role}
            onChange={(value) => setEditingUser({ ...editingUser, role: value ?? "" })}
            mb="md"
          />
          <Group justify="center" mt="xl">
            <Button variant="outline" color="red" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </Group>
        </form>
      )}
    </Modal>
  );
}
