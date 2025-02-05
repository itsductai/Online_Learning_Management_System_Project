import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Card, CardContent, Typography, Dialog } from "@mui/material";
import { registerAPI } from "../services/api";
import Center from "../components/Center";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái mở thông báo
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const res = await registerAPI(name, email, password);
      console.log("Đăng ký thành công:", res.data);
      setOpenDialog(true); // Mở thông báo đăng ký thành công
    } catch (error) {
      setError("Đăng ký thất bại, vui lòng thử lại.");
    }
  };

  return (
    <Center>
      <Card sx={{ width: 400, borderRadius: "16px", boxShadow: 3 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h3" sx={{ my: 3 }}>Đăng ký</Typography>
          {error && <Typography color="error">{error}</Typography>}
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '90%' } }}
            autoComplete="off"
            onSubmit={handleRegister}
          >
            <TextField
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              placeholder="Nhập email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Mật khẩu"
              placeholder="Nhập mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Xác nhận mật khẩu"
              placeholder="Nhập lại mật khẩu"
              type="password"
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ width: "90%", mt: 2 }}>
              Đăng ký
            </Button>
          </Box>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Đã có tài khoản? <Button onClick={() => navigate("/login")} sx={{ textTransform: "none" }}>Đăng nhập</Button>
          </Typography>
        </CardContent>
      </Card>

      {/* Dialog - Hiển thị thông báo lớn ở giữa màn hình */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <Card sx={{ width: 400, textAlign: "center", borderRadius: "16px", p: 3 }}>
          <CardContent>
            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success" width="80px" />
            <Typography variant="h4" sx={{ my: 2, fontWeight: "bold" }}>
              Đăng ký thành công!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Chúc mừng bạn đã tạo tài khoản thành công. Bây giờ bạn có thể đăng nhập.
            </Typography>
            <Button
              variant="contained"
              sx={{ width: "80%" }}
              onClick={() => navigate("/login")}
            >
              Đi tới Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </Dialog>
    </Center>
  );
}
