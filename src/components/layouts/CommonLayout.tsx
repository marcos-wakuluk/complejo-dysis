import { useState, useEffect } from "react";
import { AppShell, Group, Title, Menu, Burger } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/app/dashboard/admin/page";
import PromotorDashboard from "@/app/dashboard/promotor/page";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  role: string;
};

export function CommonLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | null>("users");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setRole(decoded.role);
    } else {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  const renderDashboard = () => {
    switch (role) {
      case "administrador":
        return <AdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case "promotor":
        return <PromotorDashboard />;
      default:
        return null;
    }
  };

  return (
    <AppShell padding="md">
      <AppShell.Header>
        <Group justify="space-between" style={{ width: "100%" }} display="flex">
          <Title order={isMobile ? 4 : 2} style={titleStyle} mt="sm">
            Complejo Dysis
          </Title>
          <Menu>
            <Menu.Target>
              <Burger></Burger>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => setActiveTab("users")}>Usuarios</Menu.Item>
              <Menu.Item onClick={() => setActiveTab("events")}>Eventos</Menu.Item>
              <Menu.Item onClick={() => setActiveTab("guests")}>Invitados</Menu.Item>
              <Menu.Item onClick={() => setActiveTab("inventory")}>Inventario</Menu.Item>
              <Menu.Item onClick={() => setActiveTab("sales")}>Ventas</Menu.Item>
              <Menu.Item onClick={handleLogout}>Cerrar sesión</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>
      <AppShell.Main style={mainStyle}>{renderDashboard()}</AppShell.Main>
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
