import { NextResponse } from 'next/server';

import { ArticleService } from '../../../../lib/service/ArticleService';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const post = await ArticleService.getArticle(postId);

  return NextResponse.json(
    post ?? { message: 'No such post!' },
    { status: post ? 200 : 404 }
  );
}
