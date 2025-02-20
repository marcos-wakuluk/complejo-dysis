import React, { useState } from "react";
import { Modal, Button, TextInput, Textarea, Group, Grid, ActionIcon, Text } from "@mantine/core";
import { Event, Tanda } from "@/types/Event";
import { IconPlus, IconTrash } from "@tabler/icons-react";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [tandas, setTandas] = useState<Tanda[]>([
    { date: "", price: 0 },
    { date: "", price: 0 },
  ]);

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleSave = () => {
    const formattedDate = formatDate(date);
    const formattedTandas = tandas.map((tanda) => ({
      ...tanda,
      date: formatDate(tanda.date),
    }));

    const newEvent: Event = {
      name,
      description,
      date: formattedDate,
      startTime,
      numberOfPeople,
      peopleEntered: 0,
      ticketsSold: 0,
      status: "Activo",
      tandas: formattedTandas,
    };

    onSave(newEvent);
    onClose();
  };

  const handleAddTanda = () => {
    setTandas([...tandas, { date: "", price: 0 }]);
  };

  const handleTandaChange = (index: number, field: keyof Tanda, value: string | number) => {
    const newTandas = [...tandas];
    newTandas[index] = {
      ...newTandas[index],
      [field]: value,
    };
    setTandas(newTandas);
    validateTandas(newTandas);
  };

  const validateTandas = (tandas: Tanda[]) => {
    for (let i = 0; i < tandas.length; i++) {
      const tandaDate = new Date(tandas[i].date);
      if (i > 0 && tandaDate <= new Date(tandas[i - 1].date)) {
        setError(`La fecha de la tanda ${i + 1} debe ser mayor que la fecha de la tanda ${i}`);
        return;
      }
    }
    setError(null);
  };

  const handleRemoveTanda = (index: number) => {
    const newTandas = tandas.filter((_, i) => i !== index);
    setTandas(newTandas);
  };

  return (
    <Modal opened={isOpen} onClose={onClose} title="Crear Nuevo Evento" centered>
      <TextInput
        label="Nombre"
        placeholder="Nombre del evento"
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        required
      />
      <TextInput
        label="Fecha"
        name="date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.currentTarget.value)}
        required
      />
      <TextInput
        label="Hora de inicio"
        placeholder="Hora de inicio del evento"
        type="time"
        value={startTime}
        onChange={(event) => setStartTime(event.currentTarget.value)}
        required
      />
      <Textarea
        label="Descripción"
        placeholder="Descripción del evento"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        required
      />
      <TextInput
        label="Capacidad"
        placeholder="Número de personas"
        type="number"
        value={numberOfPeople}
        onChange={(event) => setNumberOfPeople(Number(event.currentTarget.value))}
        required
      />
      <Group mt="md" align="center" justify="space-between">
        <Text>Tandas:</Text>
        <ActionIcon size={20} mt={2} onClick={handleAddTanda}>
          <IconPlus size={15} />
        </ActionIcon>
      </Group>
      {tandas.map((tanda, index) => (
        <Grid key={index} mt="sm" align="center">
          <Grid.Col span={6}>
            <TextInput
              label={`Tanda ${index + 1}`}
              type="date"
              value={tanda.date}
              onChange={(event) => handleTandaChange(index, "date", event.currentTarget.value)}
              required
            />
          </Grid.Col>
          <Grid.Col span={index < 2 ? 6 : 4.7}>
            <TextInput
              label="Precio"
              type="number"
              value={tanda.price === 0 ? "" : tanda.price}
              onChange={(event) => handleTandaChange(index, "price", Number(event.currentTarget.value))}
              leftSection="$"
              required
            />
          </Grid.Col>
          {index >= 2 && (
            <Grid.Col span={1.1}>
              <ActionIcon color="red" onClick={() => handleRemoveTanda(index)} mt={25}>
                <IconTrash size={16} />
              </ActionIcon>
            </Grid.Col>
          )}
        </Grid>
      ))}
      {error && (
        <Text c="red" size="xs" mt="xs">
          {error}
        </Text>
      )}

      <Group mt="md" justify="center">
        <Button onClick={onClose} variant="outline">
          Cancelar
        </Button>
        <Button onClick={handleSave}>Guardar</Button>
      </Group>
    </Modal>
  );
};

export default CreateEventModal;
