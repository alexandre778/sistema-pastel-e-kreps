import { NextResponse } from "next/server";

let caixa = {
  aberto: false,
  valorInicial: 0,
  totalVendas: 0,
};

export async function GET() {
  return NextResponse.json(caixa);
}

export async function POST(req: Request) {
  const body = await req.json();

  caixa = {
    aberto: true,
    valorInicial: body.valorInicial,
    totalVendas: 0,
  };

  return NextResponse.json({ message: "Caixa aberto" });
}

export async function PUT(req: Request) {
  const body = await req.json();

  caixa.totalVendas += body.valor;

  return NextResponse.json({ message: "Venda registrada" });
}