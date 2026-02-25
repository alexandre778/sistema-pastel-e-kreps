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

  // ✅ GERAR RECIBO PDF PROFISSIONAL
  const gerarReciboPDF = (pedido: Pedido) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("GOSTOSÃO DA LAGOA", 20, 20);

    doc.setFontSize(12);
    doc.text("Pastel & Kreps", 20, 30);
    doc.text("--------------------------------", 20, 40);

    doc.text(`Cliente: ${pedido.cliente}`, 20, 50);
    doc.text(
      `Data: ${new Date(pedido.data).toLocaleString()}`,
      20,
      60
    );

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
    <div style={{ padding: 40 }}>
      <h1>Pastel & Kreps</h1>

      <button onClick={() => router.push("/dashboard")}>
        Ir para Dashboard
      </button>

      <hr />

      <input
        type="text"
        placeholder="Nome do Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      {cardapio.map((item) => (
        <label key={item} style={{ display: "block" }}>
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
          />
          {item}
        </label>
      ))}

      <button onClick={adicionarPedido}>Adicionar Pedido</button>

      <hr />

      <h2>Pedidos</h2>

      {pedidos.map((pedido) => (
        <div key={pedido.id} style={{ marginBottom: 20 }}>
          <strong>{pedido.cliente}</strong> -
          R$ {pedido.total} -
          {pedido.pago
            ? ` Pago (${pedido.formaPagamento})`
            : " Pendente"}

          {!pedido.pago && (
            <>
              <select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
              >
                <option value="">Forma Pagamento</option>
                {formas.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>

              <button onClick={() => pagar(pedido.id)}>
                Confirmar Pagamento
              </button>
            </>
          )}

          {/* ✅ Botão PDF somente se pago */}
          {pedido.pago && (
            <button
              onClick={() => gerarReciboPDF(pedido)}
              style={{ marginLeft: 10 }}
            >
              Gerar PDF
            </button>
          )}
        </div>
      ))}
    </div>
  );
}