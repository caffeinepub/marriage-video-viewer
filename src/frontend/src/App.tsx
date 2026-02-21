import { VideoGallery } from './components/VideoGallery';
import { VideoUpload } from './components/VideoUpload';
import { Heart } from 'lucide-react';

function App() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'marriage-video-viewer'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Wedding Memories
            </h1>
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </div>
          <p className="text-center text-muted-foreground mt-2 font-light">
            Cherish every moment of our special day
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Upload Section */}
          <section>
            <VideoUpload />
          </section>

          {/* Gallery Section */}
          <section>
            <VideoGallery />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            © {currentYear} Wedding Memories. Built with{' '}
            <Heart className="inline w-4 h-4 text-rose-500 fill-rose-500 mx-1" />
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
