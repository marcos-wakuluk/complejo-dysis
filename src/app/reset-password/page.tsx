"use client";

import { useEffect, useState } from "react";
import { Button, Card, Center, PasswordInput, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useForm } from "@mantine/form";

const ResetPassword = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const form = useForm({
    initialValues: {
      password: "",
    },
    validate: {
      password: (value: string) => (value.length >= 6 ? null : "Contraseña debe tener al menos 6 caracteres"),
    },
  });

  const handleSubmit = async (values: { password: string }) => {
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: values.password, token }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Card shadow="xs" padding="xl" style={{ width: 400 }}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Text size="lg" w={700} style={{ marginBottom: 20 }}>
            Restablecer contraseña
          </Text>
          {error && <Text c="red">{error}</Text>}
          <PasswordInput label="Password" {...form.getInputProps("password")} required style={{ marginBottom: 15 }} />
          <Center>
            <Button type="submit" style={{ marginBottom: 15 }}>
              Restablecer
            </Button>
          </Center>
          <Center>
            <Text style={{ fontSize: 12 }}>
              ¿Ya tenes una cuenta?{" "}
              <Text component="span" style={{ cursor: "pointer", color: "#00bfff" }} onClick={() => router.push("/")}>
                Ingresar
              </Text>
            </Text>
          </Center>
        </form>
      </Card>
    </Center>
  );
};

export default ResetPassword;
