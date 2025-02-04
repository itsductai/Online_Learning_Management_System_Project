import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const Navbar = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav>
            {user ? (
                <>
                    <p>Xin chào, {user.Name} ({user.Role})</p>
                    <button onClick={handleLogout}>Đăng xuất</button>
                </>
            ) : (
                <p>Chưa đăng nhập</p>
            )}
        </nav>
    );
};

export default Navbar;
