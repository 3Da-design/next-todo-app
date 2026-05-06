import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: {id: 'desc'}
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const { text } = await req.json();
  const newTodo = await prisma.todo.create({
    data: { text }
  });
  return NextResponse.json(newTodo);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.todo.delete({
    where: { id }
  })
  return NextResponse.json({ message: 'Deleted' });
}

export async function PATCH(req: Request) {
  const { id, text } = await req.json();
  await prisma.todo.update({
    where: { id },
    data: { text }
  })
  return NextResponse.json({ message: 'Updated' });
}