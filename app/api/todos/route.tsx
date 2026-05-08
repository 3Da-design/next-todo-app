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
    return NextResponse.json(
      {
        status: 'success',
        message: 'Todos fetched successfully.',
        todos: todos
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch todos.',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    const { text } = await req.json();
    const newTodo = await prisma.todo.create({
      data: { text, userId: Number(user.id) }
    });
    return NextResponse.json(
      {
        status: 'success',
        message: 'Todo created successfully.',
        todo: newTodo
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create todo.',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAuthUser();
    const { id } = await req.json();

    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo || todo.userId !== Number(user.id)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'You do not have permission to delete Todo.',
        },
        { status: 403 }
      );
    }

    await prisma.todo.delete({
      where: { id }
    })
    return NextResponse.json(
      {
        status: 'success',
        message: 'Todo deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to delete Todo.',
      },
      { status: 403 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser();
    const { id, text } = await req.json();

    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo || todo.userId !== Number(user.id)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'You do not have permission to update Todo.',
        },
        { status: 403 }
      );
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { text }
    })
    return NextResponse.json(
      {
        status: 'success',
        message: 'Todo updated successfully.',
        todo: updated
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to update Todo.',
      },
      { status: 500 }
    );
  }
}