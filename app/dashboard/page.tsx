"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
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
      },
    ],
  };

  const filtrados = filtroData
    ? pagos.filter((p) =>
        p.data.startsWith(filtroData)
      )
    : pagos;

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard Financeiro</h1>

      <h2>Total Recebido: R$ {total}</h2>

      <Bar data={data} />

      <hr />

      <h3>Relatório por Data</h3>

      <input
        type="date"
        value={filtroData}
        onChange={(e) => setFiltroData(e.target.value)}
      />

      {filtrados.map((p) => (
        <div key={p.id}>
          {p.cliente} - R$ {p.total} - {p.formaPagamento}
        </div>
      ))}
    </div>
  );
}