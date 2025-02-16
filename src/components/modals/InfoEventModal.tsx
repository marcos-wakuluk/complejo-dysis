import { Modal, Table, Text, Group, Badge, Button } from "@mantine/core";

export interface Event {
  name: string;
  date: string;
  peopleEntered: number;
  ticketsSold: number;
  guests?: Guest[];
}

interface Guest {
  name: string;
  age: string;
  entered: boolean;
  vendedor: string;
}

interface InfoEventModalProps {
  readonly event: Event;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

const testGuests: Guest[] = [
  { name: "Juan Pérez", age: "30", entered: true, vendedor: "marcos" },
  { name: "María López", age: "25", entered: false, vendedor: "juan" },
  { name: "Carlos García", age: "35", entered: true, vendedor: "marcos" },
  { name: "Ana Martínez", age: "28", entered: false, vendedor: "carlos" },
  { name: "Luis Rodríguez", age: "40", entered: true, vendedor: "marcos" },
];

export function InfoEventModal({ event, isOpen, onClose }: InfoEventModalProps) {
  return (
    <Modal opened={isOpen} onClose={onClose} title="Detalles del Evento" size="lg">
      <Text size="lg" w={500}>
        {event.name}{" "}
        {new Date(event.date).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" })}
      </Text>
      <Text size="sm" c="dimmed">
        Ingresados: {event.peopleEntered}
      </Text>
      <Text size="sm" c="dimmed">
        Tickets Vendidos: {event.ticketsSold}
      </Text>

      <Table mt="md" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nombre</Table.Th>
            <Table.Th>Edad</Table.Th>
            <Table.Th>Vendedor</Table.Th>
            <Table.Th>Ingreso</Table.Th>
            <Table.Th>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {/* {event?.guests?.map((guest) => ( */}
          {testGuests.map((guest) => (
            <Table.Tr key={guest.name}>
              <Table.Td>{guest.name}</Table.Td>
              <Table.Td>{guest.age}</Table.Td>
              <Table.Td>{guest.vendedor}</Table.Td>
              <Table.Td>
                <Badge color={guest.entered ? "green" : "red"}>{guest.entered ? "Sí" : "No"}</Badge>
              </Table.Td>
              <Table.Td>
                <Button variant="outline" color="blue">
                  Cancelar
                </Button>
                <Button variant="outline" color="blue">
                  Comprobante
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group mt="md" justify="center">
        <Button onClick={onClose}>Cerrar</Button>
      </Group>
    </Modal>
  );
}
