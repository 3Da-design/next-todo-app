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