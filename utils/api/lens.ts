import { LensUserProfile } from "@/types";
import axios from "axios";

export const fetchLensProfileUsers = async (query: string) => {
  const res = await axios.post("https://api-v2.lens.dev", {
    query: `query SearchProfiles($request: ProfileSearchRequest!) {
  searchProfiles(request: $request) {
    items {
      id
      stats {
        followers
        following
      }
      metadata {
        displayName
        picture {
          ... on ImageSet {
            optimized {
              uri
            }
          }
        }
      }
    }
  }
}

`,
    variables: { request: { query } },
  });

  return res.data.data.searchProfiles.items as LensUserProfile[];
};
