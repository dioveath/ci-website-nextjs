import { NextResponse } from 'next/server';

import { UserService } from '../../../../lib/service/UserService';

// Public author card for blog posts (components/blog/BlogCard.tsx). Returns a
// fixed set of public fields, so a profile document that still carries
// pre-migration contact details never leaks them.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const { userData } = await UserService.getUser(userId);

  if (!userData) {
    return NextResponse.json({ message: 'No such user!' }, { status: 404 });
  }

  return NextResponse.json({
    id: userData.id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    profile_URL: userData.profile_URL,
    hearts: userData.hearts,
    joined_at: userData.joined_at,
  });
}
