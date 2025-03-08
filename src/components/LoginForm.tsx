"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { TextInput, PasswordInput, Paper, Title, Container, Button, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import LoadingAnimation from "./LoadingAnimation";

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      // email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length < 6 ? "Password should be at least 6 characters" : null),
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        const decodedToken = jwtDecode<{ role: string }>(data.token);
        Cookies.set("token", data.token, { expires: 7 });

        switch (decodedToken.role) {
          case "administrador":
            router.push("/dashboard/admin");
            break;
          case "usuario":
            router.push("/dashboard/user");
            break;
          case "promotor":
            router.push("/dashboard/promotor");
            break;
          case "cajero":
            router.push("/dashboard/cajero");
            break;
          case "portero":
            router.push("/dashboard/portero");
            break;
          case "barman":
            router.push("/dashboard/barman");
            break;
          default:
            alert("Unknown role");
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.log("Login error", error);
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Container size={420} my={40}>
        <Title ta="center">Marcio Wakuluk Producciones</Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput label="Email" required {...form.getInputProps("email")} />

              <PasswordInput label="Contraseña" required {...form.getInputProps("password")} />

              <Button type="submit" loading={loading}>
                Iniciar sesión
              </Button>
            </Stack>
            {error && <div className="error-message">{error}</div>}
          </form>
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Text onClick={() => router.push("/register")}>Crear una cuenta</Text>
            <Text onClick={() => router.push("/forgot-password")}>Recuperar contraseña</Text>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
