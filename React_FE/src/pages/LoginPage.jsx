import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { loginAPI } from "../services/api";
import Center from "../components/Center"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAPI(email, password);
      login(res.data);
      console.log("User Data:", res.data);
      if (res.data.Role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <Center>
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ my: 3 }}>Đăng nhập</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '90%' } }}
            autoComplete="on"
            onSubmit={handleLogin}
          >
            <TextField
              id="outlined-email"
              label="Email"
              placeholder="Nhập email"
              variant="outlined"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error ? "Vui lòng nhập email hợp lệ" : ""}
            />
            <TextField
              id="outlined-password"
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              variant="outlined"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              helperText={error ? "Sai email hoặc mật khẩu" : ""}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ width: "90%" }}
            >
              Đăng nhập
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Center>
  );
}
