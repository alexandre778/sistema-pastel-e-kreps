"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Produto = {
  id: number;
  nome: string;
  quantidade: number;
};

export default function Estoque() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [editando, setEditando] = useState<number | null>(null);
  const [novaQuantidade, setNovaQuantidade] = useState<number>(0);

  useEffect(() => {
    carregarEstoque();
  }, []);

  const carregarEstoque = async () => {
    const res = await fetch("/api/estoque");
    const data = await res.json();
    setProdutos(data);
  };

  const atualizarEstoque = async (id: number) => {
    await fetch("/api/estoque", {
      method: "PUT",
      body: JSON.stringify({
        id,
        quantidade: novaQuantidade,
      }),
    });

    setEditando(null);
    carregarEstoque();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📦 Controle de Estoque</h1>

        <button
          onClick={() => router.push("/clientes")}
          style={styles.backButton}
        >
          ← Voltar
        </button>
      </div>

      {produtos.map((produto) => (
        <div key={produto.id} style={styles.card}>
          <div>
            <strong>{produto.nome}</strong>
            <p>Quantidade: {produto.quantidade}</p>
          </div>

          {editando === produto.id ? (
            <div>
              <input
                type="number"
                value={novaQuantidade}
                onChange={(e) => setNovaQuantidade(Number(e.target.value))}
                style={styles.input}
              />

              <button
                onClick={() => atualizarEstoque(produto.id)}
                style={styles.saveButton}
              >
                Salvar
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditando(produto.id);
                setNovaQuantidade(produto.quantidade);
              }}
              style={styles.editButton}
            >
              Editar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

const styles: any = {
  container: {
    padding: 40,
    minHeight: "100vh",
    background: "#87CEFA",
    color: "#003366",
    fontFamily: "Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#005fa3",
    color: "white",
    cursor: "pointer",
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  editButton: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#0077cc",
    color: "white",
    cursor: "pointer",
  },
  saveButton: {
    marginLeft: 10,
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#28a745",
    color: "white",
    cursor: "pointer",
  },
  input: {
    padding: 6,
    borderRadius: 6,
    border: "1px solid #ccc",
    width: 80,
  },
};