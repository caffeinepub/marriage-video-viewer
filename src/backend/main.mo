import Time "mo:core/Time";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  include MixinStorage();

  type VideoMetadata = {
    title : Text;
    uploadDate : Time.Time;
    fileSize : Nat;
    video : Storage.ExternalBlob;
  };

  module VideoMetadata {
    public func compareByUploadDate(a : VideoMetadata, b : VideoMetadata) : Order.Order {
      if (a.uploadDate < b.uploadDate) #less else if (a.uploadDate > b.uploadDate) #greater else {
        #equal;
      };
    };
  };

  let videos = List.empty<VideoMetadata>();

  public shared ({ caller }) func uploadVideo(title : Text, uploadDate : Time.Time, video : Storage.ExternalBlob, fileSize : Nat) : async () {
    let metadata : VideoMetadata = {
      title;
      uploadDate;
      fileSize;
      video;
    };
    videos.add(metadata);
  };

  public query ({ caller }) func listVideos() : async [VideoMetadata] {
    videos.toArray().sort(VideoMetadata.compareByUploadDate);
  };
};
