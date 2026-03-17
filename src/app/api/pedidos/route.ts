import { NextResponse } from "next/server";

type Pedido = {
  id: number;
  cliente: string;
  itens: string[];
  total: number;
  pago: boolean;
  formaPagamento?: string;
  data: string;
};

const precos: Record<string, number> = {
  Pastel: 10,
  Kreps: 12,
  "Cerveja Lata": 6,
  "Cerveja Long Neck": 8,
  "Cerveja Litro": 15,
  "Refrigerante Lata": 5,
  "Refrigerante 2L": 10,
  "Água 500ml": 3,
  "Água 2L": 6,
  "Suco Copo": 7,
  Whisque: 20,
};

let pedidos: Pedido[] = [];

export async function GET() {
  return NextResponse.json(pedidos);
}

export async function POST(req: Request) {
  const body = await req.json();

  const total = body.itens.reduce(
    (acc: number, item: string) => acc + precos[item],
    0
  );

  const novo: Pedido = {
    id: Date.now(),
    cliente: body.cliente,
    itens: body.itens,
    total,
    pago: false,
    data: new Date().toISOString(),
  };

  pedidos.push(novo);

  return NextResponse.json(novo);
}

export async function PUT(req: Request) {
  const body = await req.json();

  pedidos = pedidos.map((p) =>
    p.id === body.id
      ? { ...p, pago: true, formaPagamento: body.formaPagamento }
      : p
  );

  return NextResponse.json({ message: "Pagamento confirmado" });
}