export type LensUserProfile = {
  id: string;
  stats: {
    followers: number;
    following: number;
  };
  metadata: {
    displayName: string;

    picture: {
      optimized: {
        uri: string;
      };
    } | null;
  } | null;
};

export type FarcasterProfile = {
  fid: number;
  custody_address: string;
  username: string;
  pfp_url: string;
  profile: {
    bio: {
      text: string;
    };
  };

  follower_count: number;
  following_count: number;
  active_status: string;
};
