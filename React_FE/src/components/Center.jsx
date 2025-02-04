import React from "react";
import { Box } from "@mui/material";

// Component giúp căn giữa nội dung
export default function Center({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Chiều cao toàn màn hình
        backgroundColor: "#f5f5f5",
      }}
    >
      {children}
    </Box>
  );
}
