"use client";

import { TextInput, PasswordInput, Paper, Title, Container, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
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
        switch (data.user.role) {
          case "admin":
            router.push("/dashboard/admin");
            break;
          case "user":
            router.push("/dashboard/user");
            break;
          default:
            alert("Unknown role");
        }
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error", error);
      alert("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Container size={420} my={40}>
        <Title ta="center">Bienvenido a Complejo Dysis</Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput label="Email" placeholder="your@email.com" required {...form.getInputProps("email")} />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                {...form.getInputProps("password")}
              />

              <Button type="submit" loading={loading}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
