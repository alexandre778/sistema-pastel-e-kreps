import { NextResponse } from "next/server";

type Produto = {
  id: number;
  nome: string;
  quantidade: number;
};

let estoque: Produto[] = [
  { id: 1, nome: "Pastel", quantidade: 50 },
  { id: 2, nome: "Kreps", quantidade: 40 },
  { id: 3, nome: "Cerveja Lata", quantidade: 100 },
  { id: 4, nome: "Refrigerante 2L", quantidade: 30 },
  { id: 5, nome: "�gua 500ml", quantidade: 80 },
];

export async function GET() {
  return NextResponse.json(estoque);
}

export async function PUT(req: Request) {
  const body = await req.json();

  estoque = estoque.map((produto) =>
    produto.id === body.id
      ? { ...produto, quantidade: body.quantidade }
      : produto
  );

  return NextResponse.json({ message: "Estoque atualizado" });
}