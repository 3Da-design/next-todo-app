import { NextResponse } from 'next/server';

let todos: string[] = [];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const { todo } = await req.json();
  todos.push(todo);
  return NextResponse.json(todos);
}

export async function DELETE(req: Request) {
  const { index } = await req.json();
  todos.splice(index, 1);
  return NextResponse.json(todos);
}

export async function PATCH(req: Request) {
  const { index, newTodo } = await req.json();
  todos[index] = newTodo;
  return NextResponse.json(todos);
}