"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const verificarLogin = (valorSenha: string) => {
    if (usuario === "admin" && valorSenha === "123") {
      localStorage.setItem("auth", "true");
      router.push("/clientes");
    } else {
      setErro("Usuário ou senha incorretos!");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#87CEFA", // Azul claro
        color: "#003366", // Azul escuro para contraste
        gap: "10px",
      }}
    >
      <h1>GOSTOSÃO DA LAGOA</h1>

      <input
        type="text"
        placeholder="Usuário"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "220px",
        }}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => {
          setSenha(e.target.value);
          verificarLogin(e.target.value);
        }}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "220px",
        }}
      />

      {erro && <p style={{ color: "red" }}>{erro}</p>}
    </div>
  );
}