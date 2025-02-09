import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Custom hook để sử dụng AuthContext dễ dàng hơn
export default function useAuthContext() {
    return useContext(AuthContext);
}
