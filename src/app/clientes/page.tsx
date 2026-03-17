"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";

type Pedido = {
  id: number;
  cliente: string;
  itens: string[];
  total: number;
  pago: boolean;
  formaPagamento?: string;
  data: string;
};

const cardapio = [
  "Pastel",
  "Kreps",
  "Cerveja Lata",
  "Cerveja Long Neck",
  "Cerveja Litro",
  "Refrigerante Lata",
  "Refrigerante 2L",
  "Água 500ml",
  "Água 2L",
  "Suco Copo",
  "Whisque"
];

const formas = ["Dinheiro", "Pix", "Cartão Crédito", "Cartão Débito"];

export default function Clientes() {
  const router = useRouter();
  const [cliente, setCliente] = useState("");
  const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [formaPagamento, setFormaPagamento] = useState("");

  useEffect(() => {
    if (localStorage.getItem("auth") !== "true") {
      router.push("/");
    }
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    const res = await fetch("/api/pedidos");
    const data = await res.json();
    setPedidos(data);
  };

  const adicionarPedido = async () => {
    if (!cliente || itensSelecionados.length === 0) return;

    await fetch("/api/pedidos", {
      method: "POST",
      body: JSON.stringify({ cliente, itens: itensSelecionados }),
    });

    setCliente("");
    setItensSelecionados([]);
    carregarPedidos();
  };

  const pagar = async (id: number) => {
    if (!formaPagamento) return alert("Selecione forma de pagamento");

    await fetch("/api/pedidos", {
      method: "PUT",
      body: JSON.stringify({ id, formaPagamento }),
    });

    setFormaPagamento("");
    carregarPedidos();
  };

  const gerarReciboPDF = (pedido: Pedido) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("GOSTOSÃO DA LAGOA", 20, 20);
    doc.setFontSize(12);
    doc.text("Pastel & Kreps", 20, 30);
    doc.text("--------------------------------", 20, 40);

    doc.text(`Cliente: ${pedido.cliente}`, 20, 50);
    doc.text(`Data: ${new Date(pedido.data).toLocaleString()}`, 20, 60);

    let y = 70;
    pedido.itens.forEach((item) => {
      doc.text("- " + item, 20, y);
      y += 8;
    });

    doc.text("--------------------------------", 20, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`Total: R$ ${pedido.total.toFixed(2)}`, 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Pagamento: ${pedido.formaPagamento}`, 20, y);
    y += 20;

    doc.text("Obrigado pela preferência!", 20, y);

    doc.save(`recibo-${pedido.cliente}.pdf`);
  };

  return (
    <div style={styles.container}>
      <h1>Pastel & Kreps</h1>

      {/* BOTÕES SUPERIORES */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => router.push("/dashboard")} style={styles.button}>
          Ir para Dashboard
        </button>

        <button
          onClick={() => router.push("/estoque")}
          style={{ ...styles.button, marginLeft: 10 }}
        >
          Ir para Estoque
        </button>
      </div>

      <hr />

      <input
        type="text"
        placeholder="Nome do Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        style={styles.input}
      />

      {cardapio.map((item) => (
        <label key={item} style={{ display: "block", marginBottom: 5 }}>
          <input
            type="checkbox"
            value={item}
            checked={itensSelecionados.includes(item)}
            onChange={(e) =>
              e.target.checked
                ? setItensSelecionados([...itensSelecionados, item])
                : setItensSelecionados(
                    itensSelecionados.filter((i) => i !== item)
                  )
            }
          />{" "}
          {item}
        </label>
      ))}

      <button onClick={adicionarPedido} style={styles.addButton}>
        Adicionar Pedido
      </button>

      <hr />

      <h2>Pedidos</h2>

      {pedidos.map((pedido) => (
        <div key={pedido.id} style={styles.card}>
          <strong>{pedido.cliente}</strong> - R$ {pedido.total} -
          {pedido.pago
            ? ` Pago (${pedido.formaPagamento})`
            : " Pendente"}

          {!pedido.pago && (
            <div style={{ marginTop: 10 }}>
              <select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
                style={styles.select}
              >
                <option value="">Forma Pagamento</option>
                {formas.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>

              <button
                onClick={() => pagar(pedido.id)}
                style={styles.payButton}
              >
                Confirmar Pagamento
              </button>
            </div>
          )}

          {pedido.pago && (
            <button
              onClick={() => gerarReciboPDF(pedido)}
              style={styles.button}
            >
              Gerar PDF
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
  button: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#005fa3",
    color: "white",
    cursor: "pointer",
  },
  addButton: {
    marginTop: 10,
    padding: "8px 16px",
    borderRadius: 8,
    border: "none",
    background: "#0077cc",
    color: "white",
    cursor: "pointer",
  },
  payButton: {
    marginLeft: 10,
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#28a745",
    color: "white",
    cursor: "pointer",
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginBottom: 15,
    display: "block",
  },
  select: {
    padding: 6,
    borderRadius: 6,
  },
  card: {
    background: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
};