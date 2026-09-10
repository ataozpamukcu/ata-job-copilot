import { NextResponse } from "next/server"; import { readStore, writeStore } from "@/lib/store";
export const runtime="nodejs";
export async function GET(){return NextResponse.json(await readStore());}
export async function PUT(req:Request){const body=await req.json(); await writeStore(body); return NextResponse.json(body);}
