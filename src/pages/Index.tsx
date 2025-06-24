import { useSeoMeta } from '@unhead/react';
import { Header } from '@/components/Header';
import { NoteFeed } from '@/components/NoteFeed';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Heart } from 'lucide-react';

const Index = () => {
  const { user } = useCurrentUser();

  useSeoMeta({
    title: 'Pura Vida - Spread Positivity on Nostr',
    description: 'A Nostr social application focused on spreading positivity with simple "PV" replies.',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Leaf className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Pura Vida
                </h1>
                <Heart className="h-6 w-6 text-primary/70" />
              </div>
              <p className="text-xl text-muted-foreground max-w-md mx-auto">
                Spread positivity across the Nostr network with simple "PV" replies
              </p>
            </div>

            {user && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="py-4">
                  <p className="text-sm text-primary font-medium">
                    ¡Pura Vida! Click the "PV" button on any note to spread positivity 🌿
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Notes Feed */}
          <NoteFeed />

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/50">
            <p>
              Vibed with{" "}
              <a
                href="https://soapbox.pub/tools/mkstack/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                MKStack
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
