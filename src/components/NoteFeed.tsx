import { useNotes } from '@/hooks/useNotes';
import { useFollowing } from '@/hooks/useFollowing';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Note } from '@/components/Note';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RelaySelector } from '@/components/RelaySelector';
import { LoginArea } from '@/components/auth/LoginArea';
import { RefreshCw, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NoteFeed() {
  const { user } = useCurrentUser();
  const { data: following = [], isLoading: isLoadingFollowing } = useFollowing();
  const { data: notes, isLoading, error, refetch, isRefetching } = useNotes();

  // Show login prompt if user is not logged in
  if (!user) {
    return (
      <Card className="border-dashed border-primary/50">
        <CardContent className="py-12 px-8 text-center">
          <div className="max-w-sm mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Connect to see your feed</h3>
              <p className="text-muted-foreground text-sm">
                Log in with your Nostr account to see notes from people you follow and start spreading good vibes.
              </p>
            </div>
            <LoginArea className="w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show loading state
  if (isLoading || isLoadingFollowing) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Show empty following list state
  if (following.length === 0) {
    return (
      <Card className="border-dashed border-primary/50">
        <CardContent className="py-12 px-8 text-center">
          <div className="max-w-sm mx-auto space-y-6">
            <div className="flex justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Follow some people</h3>
              <p className="text-muted-foreground text-sm">
                You're not following anyone yet. Use other Nostr clients to follow people, then come back to see their notes and spread some PV!
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                disabled={isRefetching}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                Check Again
              </Button>
              <RelaySelector className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-dashed border-destructive/50">
        <CardContent className="py-12 px-8 text-center">
          <div className="max-w-sm mx-auto space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-destructive">
                Failed to load notes
              </h3>
              <p className="text-muted-foreground text-sm">
                There was an error connecting to the relay. Try switching to a different relay or refresh the page.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                disabled={isRefetching}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                Retry
              </Button>
              <RelaySelector className="w-full sm:w-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 px-8 text-center">
          <div className="max-w-sm mx-auto space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No recent notes</h3>
              <p className="text-muted-foreground text-sm">
                No recent notes from people you follow are available on this relay. They might be posting on different relays or haven't posted recently.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                disabled={isRefetching}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <RelaySelector className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Your Feed
          </h2>
          <p className="text-sm text-muted-foreground">
            Notes from {following.length} people you follow
          </p>
        </div>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          size="sm"
          disabled={isRefetching}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-4">
        {notes.map((note) => (
          <Note key={note.id} event={note} />
        ))}
      </div>
    </div>
  );
}