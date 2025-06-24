import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useFollowing } from '@/hooks/useFollowing';

export function useNotes() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { data: following = [], isLoading: isLoadingFollowing } = useFollowing();

  return useQuery({
    queryKey: ['notes', user?.pubkey, following],
    queryFn: async (c) => {
      if (!user?.pubkey) {
        return [];
      }

      // If user has no following list, return empty array
      if (following.length === 0) {
        return [];
      }

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      // Query notes only from users the logged-in user follows
      const events = await nostr.query([{ 
        kinds: [1], 
        authors: following,
        limit: 50 
      }], { signal });
      
      // Sort by created_at descending (newest first)
      return events.sort((a, b) => b.created_at - a.created_at);
    },
    enabled: !!user?.pubkey && !isLoadingFollowing,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

