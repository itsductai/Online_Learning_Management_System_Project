import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Card, CardContent, Typography } from "@mui/material";
import { registerAPI } from "../services/api";
import Center from "../components/Center"; 

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      await registerAPI(name, email, password);
      navigate("/login");
    } catch (error) {
      setError("Đăng ký thất bại, vui lòng thử lại.");
    }
  };

  return (
    <Center>
      <Card sx={{ width: 400 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ my: 3 }}>Đăng ký</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '90%' } }}
            onSubmit={handleRegister}
          >
            <TextField
              label="Họ và Tên"
              placeholder="Nhập họ và tên"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              placeholder="Nhập email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ width: "100%", mt: 2 }}>
              Đăng ký
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Đã có tài khoản?  
            <Button variant="text" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
          </Typography>

          <Button variant="outlined" sx={{ width: "100%", mt: 2 }}>
            Đăng ký bằng Google
          </Button>
        </CardContent>
      </Card>
    </Center>
  );
}
