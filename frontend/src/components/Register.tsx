import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const Register:React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
  return (
    <div>Register</div>
  )
}
