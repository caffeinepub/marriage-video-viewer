import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { useUploadVideo } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Video, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function VideoUpload() {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadVideo();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      toast.error('Please provide a title and select a video file');
      return;
    }

    try {
      setUploadProgress(0);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const videoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress(
        (percentage) => {
          setUploadProgress(percentage);
        }
      );

      await uploadMutation.mutateAsync({
        title: title.trim(),
        videoBlob,
        fileSize: BigInt(selectedFile.size),
      });

      toast.success('Video uploaded successfully!');
      setTitle('');
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video. Please try again.');
      setUploadProgress(0);
    }
  };

  const isUploading = uploadMutation.isPending;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl md:text-3xl font-serif font-bold text-foreground">
          Share Your Memories
        </CardTitle>
        <CardDescription className="text-base">
          Upload wedding videos to preserve and share special moments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-medium">
            Video Title
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="e.g., First Dance, Ceremony, Reception"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
            className="text-base"
          />
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <Label className="text-base font-medium">Video File</Label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border hover:border-primary/50 hover:bg-accent/30'
            } ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={isUploading}
            />
            <div className="flex flex-col items-center gap-4 text-center">
              {selectedFile ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  {!isUploading && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      Change File
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      Drop your video here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports MP4, MOV, AVI and other video formats
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="font-medium text-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Upload Status Messages */}
        {uploadMutation.isSuccess && !isUploading && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300">
              Video uploaded successfully!
            </p>
          </div>
        )}

        {uploadMutation.isError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <p className="text-sm text-destructive">
              Upload failed. Please try again.
            </p>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !title.trim() || isUploading}
          className="w-full text-base py-6 font-semibold"
          size="lg"
        >
          {isUploading ? (
            <>Uploading... {uploadProgress}%</>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload Video
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
