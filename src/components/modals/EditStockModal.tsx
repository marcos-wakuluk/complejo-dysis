import { Modal, Button, NumberInput, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { InventoryItem } from "@/types/InventoryItem";

interface EditStockModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSave: (item: InventoryItem) => void;
  readonly item: InventoryItem;
}

export function EditStockModal({ isOpen, onClose, onSave, item }: EditStockModalProps) {
  const form = useForm({
    initialValues: { quantity: item.quantity },
  });

  const handleSubmit = (values: { quantity: number }) => {
    onSave({ ...item, quantity: values.quantity });
    onClose();
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Editar Stock">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <NumberInput label="Cantidad" {...form.getInputProps("quantity")} required />
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
