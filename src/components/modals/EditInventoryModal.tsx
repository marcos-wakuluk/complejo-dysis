import { Modal, Button, TextInput, NumberInput, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { InventoryItem } from "@/types/InventoryItem";

interface EditInventoryModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (item: InventoryItem) => void;
  readonly item: InventoryItem;
}

export function EditInventoryModal({ isOpen, onClose, onSave, item }: EditInventoryModalProps) {
  const form = useForm({
    initialValues: item,
  });

  const handleSubmit = (values: InventoryItem) => {
    onSave(values);
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Editar Inventario">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Nombre" {...form.getInputProps("name")} required />
        <TextInput label="Descripción" {...form.getInputProps("description")} />
        <TextInput label="Categoría" {...form.getInputProps("category")} required />
        <NumberInput label="Cantidad" {...form.getInputProps("quantity")} required />
        <TextInput label="Precio" {...form.getInputProps("price")} required />
        <TextInput label="Estado" {...form.getInputProps("status")} required />
        <Group justify="center" mt="md">
          <Button variant="outline" color="red" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </Group>
      </form>
    </Modal>
  );
}
