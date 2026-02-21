import { useEffect, useRef } from 'react';
import type { VideoMetadata } from '../backend';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Calendar, HardDrive } from 'lucide-react';

interface VideoPlayerProps {
  video: VideoMetadata;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [video]);

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] p-0 gap-0 bg-card/95 backdrop-blur-md border-border/50">
        <DialogHeader className="p-6 pb-4 space-y-3">
          <DialogTitle className="text-2xl font-serif font-bold text-foreground">
            {video.title}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(video.uploadDate)}
            </span>
            <span className="flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              {formatFileSize(video.fileSize)}
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="w-full bg-black">
          <video
            ref={videoRef}
            src={video.video.getDirectURL()}
            controls
            autoPlay
            className="w-full max-h-[70vh] object-contain"
            controlsList="nodownload"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
