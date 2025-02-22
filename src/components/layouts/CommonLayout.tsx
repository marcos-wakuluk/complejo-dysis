import { ReactNode } from "react";
import { AppShell, Group, Title, Menu, Burger } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function CommonLayout({ children }: Readonly<{ children: ReactNode }>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  return (
    <AppShell padding="md">
      <AppShell.Header>
        <Group justify="space-between" style={{ width: "100%" }} display="flex">
          <Title order={isMobile ? 4 : 2} style={titleStyle} mt="sm">
            Marcio Wakuluk Producciones
          </Title>
          <Menu>
            <Menu.Target>
              <Burger></Burger>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => {}}>Usuarios</Menu.Item>
              <Menu.Item onClick={() => {}}>Eventos</Menu.Item>
              <Menu.Item onClick={() => {}}>Invitados</Menu.Item>
              <Menu.Item onClick={() => {}}>Inventario</Menu.Item>
              <Menu.Item onClick={() => {}}>Ventas</Menu.Item>
              <Menu.Item onClick={handleLogout}>Cerrar sesión</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>
      <AppShell.Main style={mainStyle}>{children}</AppShell.Main>
    </AppShell>
  );
}

const titleStyle = {
  fontSize: "2rem",
  color: "#00bfff",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  marginBottom: "1.5rem",
  fontFamily: "Arial Black",
  justifySelf: "center",
  marginLeft: "2%",
};

const mainStyle = {
  display: "block",
  justifyContent: "center",
  alignItems: "center",
  height: "calc(100vh - 30px)",
  paddingTop: "60px",
  marginTop: "60px",
};
