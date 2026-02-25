import { NextResponse } from "next/server";

type Cliente = {
  id: number;
  nome: string;
  pedido: string;
  pago: boolean;
};

// Simulando banco temporário
let clientes: Cliente[] = [];
let contador = 1;

export async function GET() {
  return NextResponse.json(clientes);
}

export async function POST(req: Request) {
  const body = await req.json();

  const novoCliente: Cliente = {
    id: contador++,
    nome: body.nome,
    pedido: body.pedido,
    pago: false,
  };

  clientes.push(novoCliente);

  return NextResponse.json(novoCliente);
}

export async function PUT(req: Request) {
  const body = await req.json();

  clientes = clientes.map((cliente) =>
    cliente.id === body.id ? { ...cliente, pago: true } : cliente
  );

  return NextResponse.json({ message: "Pago com sucesso" });
}

export async function DELETE(req: Request) {
  const body = await req.json();

  clientes = clientes.filter((cliente) => cliente.id !== body.id);

  return NextResponse.json({ message: "Cliente removido" });
}