import { NextResponse } from 'next/server';
import { getUser } from '@/lib/users';


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const userData = await getUser(userId);

  return NextResponse.json(
    userData ?? { message: 'No such user!' },
    { status: userData ? 200 : 404 }
  );
}
