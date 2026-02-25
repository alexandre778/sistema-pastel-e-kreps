"use client";

import { useEffect, useState } from "react";

export default function Estoque() {
  const [produtos, setProdutos] = useState<any[]>([]);

  const carregar = async () => {
    const res = await fetch("/api/estoque");
    const data = await res.json();
    setProdutos(data);
  };

  useEffect(() => {
    carregar();
  }, []);

  const atualizar = async (id: number, quantidade: number) => {
    await fetch("/api/estoque", {
      method: "PUT",
      body: JSON.stringify({ id, quantidade }),
    });
    carregar();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Controle de Estoque</h1>

      {produtos.map((p) => (
        <div key={p.id}>
          {p.nome} - Estoque: {p.quantidade}
          <button onClick={() => atualizar(p.id, p.quantidade + 10)}>
            +10
          </button>
        </div>
      ))}
    </div>
  );
}