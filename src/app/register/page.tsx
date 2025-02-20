"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";
import { Button, Card, Text, Group, TextInput, Center } from "@mantine/core";

interface RegisterFormValues {
  name: string;
  lastname: string;
  dni: string;
  birthday: string;
  email: string;
  phone: string;
  instagram?: string;
  image?: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    initialValues: {
      name: "",
      lastname: "",
      dni: "",
      birthday: "",
      email: "",
      phone: "",
      instagram: "",
      image: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) => (value ? null : "Nombre es requerido"),
      lastname: (value) => (value ? null : "Apellido es requerido"),
      dni: (value) => (value ? null : "DNI es requerido"),
      birthday: (value) => (value ? null : "Fecha de nacimiento es requerida"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email no es válido"),
      phone: (value) => (value ? null : "Telefono es requerido"),
      password: (value) => (value.length >= 6 ? null : "Contraseña debe tener al menos 6 caracteres"),
      confirmPassword: (value, values) => (value === values.password ? null : "Las contraseñas no coinciden"),
    },
  });

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      router.push("/login");
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card shadow="sm" m="lg" radius="md" withBorder>
        <Text size="lg" w={500} mb="md">
          Crear Cuenta
        </Text>
        {error && <Text c="red">{error}</Text>}
        <form onSubmit={form.onSubmit(handleRegister)}>
          <Group grow mb="md">
            <TextInput label="Nombre" {...form.getInputProps("name")} withAsterisk required />
            <TextInput label="Apellido" {...form.getInputProps("lastname")} withAsterisk required />
          </Group>
          <Group grow mb="md">
            <TextInput label="DNI" {...form.getInputProps("dni")} withAsterisk required />
            <TextInput label="Fecha de nacimiento" {...form.getInputProps("birthday")} withAsterisk required />
          </Group>
          <TextInput label="Email" {...form.getInputProps("email")} mb="md" withAsterisk required />
          <Group grow mb="md">
            <TextInput label="Telefono" {...form.getInputProps("phone")} withAsterisk required />
            <TextInput label="Instagram" {...form.getInputProps("instagram")} />
          </Group>
          <TextInput label="Foto" {...form.getInputProps("image")} mb="md" />
          <TextInput
            label="Contraseña"
            type="password"
            {...form.getInputProps("password")}
            mb="md"
            withAsterisk
            required
          />
          <TextInput
            label="Confirmar Contraseña"
            type="password"
            {...form.getInputProps("confirmPassword")}
            mb="md"
            withAsterisk
            required
          />
          <Center>
            <Button type="submit">Registrar</Button>
          </Center>
        </form>
        <Center>
          <Text style={{ fontSize: 12 }}>
            ¿Ya tenes una cuenta?{" "}
            <Text component="span" style={{ cursor: "pointer", color: "#00bfff" }} onClick={() => router.push("/")}>
              Ingresar
            </Text>
          </Text>
        </Center>
      </Card>
    </div>
  );
};

export default Register;
