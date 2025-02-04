import { useState } from "react";

export default function useForm(getFreshModelObj) {
    const [values, setValues] = useState(getFreshModelObj());
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
    };

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange
    };
}
