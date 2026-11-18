'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import LoadingScreen from '../../components/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import GoogleMark from '@/components/brand/GoogleMark';
import useAuth from '@/lib/auth';

// Google is the only sign-in method. There is no separate sign-up: the first
// Google sign-in creates the user's profile (see AuthProvider in lib/auth.tsx).
export default function LoginContent() {
  const { error, fetching, loading, isLoggedIn, loginWithGoogle } = useAuth();
  const router = useRouter();

  const signedIn = !loading && !fetching && isLoggedIn;

  // Navigation is a side effect, so it runs after render rather than during it.
  useEffect(() => {
    if (signedIn) router.push('/dashboard');
  }, [signedIn, router]);

  if (loading || signedIn) return <LoadingScreen label="Signing you in" />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-6 py-16">
      <Card className="w-full max-w-md">
        <CardContent>
          <div className="flex flex-col items-center gap-6 text-center">
          <Image
            src="/ci_pc.svg"
            alt=""
            width={500}
            height={300}
            priority
            className="h-auto w-full max-w-xs"
          />

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-card-foreground">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your Google account. New here? Signing in creates your account.
            </p>
          </div>

          {error ? (
            <p
              role="alert"
              className="w-full rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          <Button
            size="xl"
            className="w-full"
            disabled={fetching}
            onClick={() => loginWithGoogle()}
          >
            <GoogleMark />
            {fetching ? 'Signing in...' : 'Continue with Google'}
          </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
