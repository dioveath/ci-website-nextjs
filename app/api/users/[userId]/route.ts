import { NextResponse } from 'next/server';

import { UserService } from '../../../../lib/service/UserService';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const { userData } = await UserService.getUser(userId);

  return NextResponse.json(
    userData ?? { message: 'No such user!' },
    { status: userData ? 200 : 404 }
  );
}
