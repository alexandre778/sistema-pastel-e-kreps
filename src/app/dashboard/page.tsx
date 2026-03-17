"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [filtroData, setFiltroData] = useState("");

  useEffect(() => {
    fetch("/api/pedidos")
      .then((res) => res.json())
      .then(setPedidos);
  }, []);

  const pagos = pedidos.filter((p) => p.pago);
  const total = pagos.reduce((acc, p) => acc + p.total, 0);

  const porForma: Record<string, number> = {};

  pagos.forEach((p) => {
    if (!porForma[p.formaPagamento]) {
      porForma[p.formaPagamento] = 0;
    }
    porForma[p.formaPagamento] += p.total;
  });

  const data = {
    labels: Object.keys(porForma),
    datasets: [
      {
        label: "Total por Forma de Pagamento",
        data: Object.values(porForma),
        backgroundColor: "#005fa3", // mesma cor azul do sistema
      },
    ],
  };

  const filtrados = filtroData
    ? pagos.filter((p) => p.data.startsWith(filtroData))
    : pagos;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Dashboard Financeiro</h1>

        <button
          onClick={() => router.push("/clientes")}
          style={styles.backButton}
        >
          ← Voltar para Pedidos
        </button>
      </div>

      <div style={styles.card}>
        <h2>Total Recebido</h2>
        <p style={styles.totalValue}>R$ {total.toFixed(2)}</p>
      </div>

      <div style={styles.card}>
        <Bar data={data} />
      </div>

      <div style={styles.card}>
        <h3>Relatório por Data</h3>

        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          style={styles.input}
        />

        <div style={{ marginTop: 20 }}>
          {filtrados.map((p) => (
            <div key={p.id} style={styles.item}>
              {p.cliente} — R$ {p.total} — {p.formaPagamento}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    padding: 40,
    background: "#87CEFA", // azul claro igual Clientes
    minHeight: "100vh",
    color: "#003366",
    fontFamily: "Arial",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#005fa3",
    color: "white",
    padding: "10px 18px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 12,
    marginBottom: 30,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#005fa3",
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  item: {
    padding: 10,
    borderBottom: "1px solid #eee",
  },
};