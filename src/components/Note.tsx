import { useState } from 'react';
import type { NostrEvent } from '@nostrify/nostrify';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthor } from '@/hooks/useAuthor';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrPublish } from '@/hooks/useNostrPublish';
import { NoteContent } from '@/components/NoteContent';
import { genUserName } from '@/lib/genUserName';
import { cn } from '@/lib/utils';

interface NoteProps {
  event: NostrEvent;
  className?: string;
}

export function Note({ event, className }: NoteProps) {
  const [isReplying, setIsReplying] = useState(false);
  const author = useAuthor(event.pubkey);
  const { user } = useCurrentUser();
  const { mutate: createEvent } = useNostrPublish();

  const metadata = author.data?.metadata;
  const displayName = metadata?.display_name || metadata?.name || genUserName(event.pubkey);
  const profileImage = metadata?.picture;
  const about = metadata?.about;

  const handlePvReply = () => {
    if (!user) return;
    
    setIsReplying(true);
    
    createEvent({
      kind: 1,
      content: 'PV',
      tags: [
        ['e', event.id, '', 'reply'],
        ['p', event.pubkey],
      ],
    }, {
      onSuccess: () => {
        setIsReplying(false);
      },
      onError: () => {
        setIsReplying(false);
      },
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profileImage} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">{displayName}</span>
                <Badge variant="secondary" className="text-xs">
                  {formatDate(event.created_at)}
                </Badge>
              </div>
              {about && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {about}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="whitespace-pre-wrap break-words">
            <NoteContent event={event} className="text-sm leading-relaxed" />
          </div>
          
          {user && (
            <div className="flex justify-end pt-2 border-t border-border/50">
              <Button
                onClick={handlePvReply}
                disabled={isReplying}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6"
              >
                {isReplying ? 'Sending...' : 'PV'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}