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
