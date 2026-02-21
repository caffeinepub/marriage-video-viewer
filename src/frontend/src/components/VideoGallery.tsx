import { useState } from 'react';
import { useListVideos } from '../hooks/useQueries';
import { VideoPlayer } from './VideoPlayer';
import type { VideoMetadata } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Calendar, HardDrive } from 'lucide-react';

export function VideoGallery() {
  const { data: videos, isLoading, error } = useListVideos();
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(null);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: bigint) => {
    const mb = Number(bytes) / (1024 * 1024);
    if (mb < 1024) {
      return `${mb.toFixed(1)} MB`;
    }
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load videos. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
            Video Gallery
          </h2>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `${videos?.length || 0} precious memories`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full aspect-video" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card
                key={index}
                className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-border/50 bg-card/80 backdrop-blur-sm"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <video
                    src={video.video.getDirectURL()}
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/90 group-hover:bg-primary flex items-center justify-center transition-all group-hover:scale-110">
                      <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-5 space-y-3">
                  <h3 className="font-serif font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(video.uploadDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      <span>{formatFileSize(video.fileSize)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Play className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-semibold text-foreground">
                No videos yet
              </h3>
              <p className="text-muted-foreground">
                Upload your first wedding video to get started
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedVideo && (
        <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </>
  );
}
