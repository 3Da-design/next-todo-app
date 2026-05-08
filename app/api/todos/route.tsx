import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

async function getAuthUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user;
}

export async function GET() {
  try {
    const user = await getAuthUser();
    const todos = await prisma.todo.findMany({
      where: { userId: Number(user.id) },
      orderBy: {id: 'desc'}
    });
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    const { text } = await req.json();
    const newTodo = await prisma.todo.create({
      data: { text, userId: Number(user.id) }
    });
    return NextResponse.json(newTodo);
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAuthUser();
    const { id } = await req.json();

    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo || todo.userId !== Number(user.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.todo.delete({
      where: { id }
    })
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser();
    const { id, text } = await req.json();

    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo || todo.userId !== Number(user.id)) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.todo.update({
      where: { id },
      data: { text }
    })
    return NextResponse.json({ message: 'Updated' });
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}