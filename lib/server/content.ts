import 'server-only';

import { createClient, type SanityClient } from '@sanity/client';
import type { PortableTextBlock } from '@portabletext/types';

import { apiVersion, projectId } from '../sanity/client';
import { lessonContentQuery } from '../sanity/queries';
import type { CourseId, LessonId, VideoPlayback, VideoSource } from '../../types/courses';

/*
 * Paid lesson content. Only ever called after the caller's access has been
 * checked (app/courses/actions.ts).
 */

/** Served from /public until Cloudflare Stream is set up. */
export const PLACEHOLDER_VIDEO_URL = '/videos/placeholder-lesson.mp4';

const CONTENT_DATASET = process.env.SANITY_CONTENT_DATASET || 'course-content';
const READ_TOKEN = process.env.SANITY_READ_TOKEN;

// The private dataset needs a token with read access (sanity.io/manage ->
// API -> Tokens -> Viewer). Without one, lessons still open, minus their
// written content.
const contentClient: SanityClient | null =
  projectId && READ_TOKEN
    ? createClient({
        projectId,
        dataset: CONTENT_DATASET,
        apiVersion,
        token: READ_TOKEN,
        useCdn: false,
        perspective: 'published',
      })
    : null;

/** The lesson's article body or video notes, or null when there is none yet. */
export async function getLessonBody(courseId: CourseId, lessonId: LessonId): Promise<PortableTextBlock[] | null> {
  if (!contentClient) return null;
  try {
    const result = await contentClient.fetch<{ body?: PortableTextBlock[] } | null>(lessonContentQuery, {
      courseId,
      lessonId,
    });
    return result?.body?.length ? result.body : null;
  } catch (error) {
    // The video still plays; only the text is missing. Logged for the team.
    console.error('[content] lesson body lookup failed:', error);
    return null;
  }
}

let warnedAboutCloudflare = false;

/**
 * A playable URL for a video lesson.
 *
 * Every lesson plays the placeholder for now. When Cloudflare Stream is set
 * up, enable "require signed URLs" on the videos and issue a short-lived
 * token here for `{ provider: 'cloudflare' }` sources (Stream API:
 * POST /accounts/{account_id}/stream/{video_uid}/token), returning
 * https://customer-<code>.cloudflarestream.com/<token>/manifest/video.m3u8
 * with its expiry. react-player plays HLS as is.
 */
export async function resolvePlayback(source: VideoSource | null): Promise<VideoPlayback> {
  if (source?.provider === 'cloudflare' && !warnedAboutCloudflare) {
    warnedAboutCloudflare = true;
    console.warn('[content] Cloudflare Stream is not set up yet; playing the placeholder video instead.');
  }
  return { url: PLACEHOLDER_VIDEO_URL, expiresAt: null, isPlaceholder: true };
}
