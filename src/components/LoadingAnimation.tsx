import { Center } from "@mantine/core";
import { motion } from "framer-motion";

export default function LoadingAnimation() {
  return (
    <Center style={{ height: "500px", flexDirection: "column" }}>
      <motion.img
        src="/logo.png"
        alt="Logo"
        width={200}
        height={200}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
      />
    </Center>
  );
}
