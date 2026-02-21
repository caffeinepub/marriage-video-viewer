import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VideoMetadata } from '../backend';
import { ExternalBlob } from '../backend';

export function useListVideos() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoMetadata[]>({
    queryKey: ['videos'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      videoBlob,
      fileSize,
    }: {
      title: string;
      videoBlob: ExternalBlob;
      fileSize: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      const uploadDate = BigInt(Date.now() * 1_000_000); // Convert to nanoseconds
      await actor.uploadVideo(title, uploadDate, videoBlob, fileSize);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
}
