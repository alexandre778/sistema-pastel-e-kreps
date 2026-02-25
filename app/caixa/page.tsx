"use client";

import { useEffect, useState } from "react";

export default function Caixa() {
  const [caixa, setCaixa] = useState<any>(null);
  const [valorInicial, setValorInicial] = useState("");

  const carregar = async () => {
    const res = await fetch("/api/caixa");
    const data = await res.json();
    setCaixa(data);
  };

  useEffect(() => {
    carregar();
  }, []);

  const abrirCaixa = async () => {
    await fetch("/api/caixa", {
      method: "POST",
      body: JSON.stringify({ valorInicial: Number(valorInicial) }),
    });
    carregar();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Caixa Diário</h1>

      {!caixa?.aberto ? (
        <>
          <input
            type="number"
            placeholder="Valor inicial"
            value={valorInicial}
            onChange={(e) => setValorInicial(e.target.value)}
          />
          <button onClick={abrirCaixa}>Abrir Caixa</button>
        </>
      ) : (
        <>
          <p>Caixa Aberto</p>
          <p>Valor Inicial: R$ {caixa.valorInicial}</p>
          <p>Total de Vendas: R$ {caixa.totalVendas}</p>
          <p>Total em Caixa: R$ {caixa.valorInicial + caixa.totalVendas}</p>
        </>
      )}
    </div>
  );
}