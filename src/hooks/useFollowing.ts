import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function useFollowing() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();

  return useQuery({
    queryKey: ['following', user?.pubkey],
    queryFn: async (c) => {
      if (!user?.pubkey) {
        return [];
      }

      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(5000)]);
      
      // Fetch the user's contact list (kind 3)
      const contactEvents = await nostr.query([{ 
        kinds: [3], 
        authors: [user.pubkey],
        limit: 1 
      }], { signal });

      if (contactEvents.length === 0) {
        return [];
      }

      // Get the most recent contact list
      const latestContactEvent = contactEvents.sort((a, b) => b.created_at - a.created_at)[0];
      
      // Extract pubkeys from p tags
      const followingPubkeys = latestContactEvent.tags
        .filter(([tagName]) => tagName === 'p')
        .map(([, pubkey]) => pubkey)
        .filter(Boolean);

      return followingPubkeys;
    },
    enabled: !!user?.pubkey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}