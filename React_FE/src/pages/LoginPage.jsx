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
      if (res.data.role === "Admin") {
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
      <Card sx={{ width: 400, borderRadius: "16px", boxShadow: 3 }}>
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
              label="Email"
              placeholder="Nhập email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              helperText={error ? "Vui lòng nhập email hợp lệ" : ""}
            />
            <TextField
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              helperText={error ? "Sai email hoặc mật khẩu" : ""}
            />
            <Button type="submit" variant="contained" sx={{ width: "100%", mt: 2 }}>
              Đăng nhập
            </Button>
          </Box>

          {/* Nút điều hướng sang trang đăng ký */}
          <Typography variant="body2" sx={{ mt: 2 }}>
            Bạn chưa có tài khoản?  
            <Button variant="text" onClick={() => navigate("/register")}>
              Đăng ký
            </Button>
          </Typography>

          {/* Nút đăng nhập bằng Google (chưa tích hợp OAuth) */}
          <Button variant="outlined" sx={{ width: "100%", mt: 3 }}>
            Đăng nhập bằng Google
          </Button>
        </CardContent>
      </Card>
    </Center>
  );
}
