import { adminSupabase } from "../server";

export default async function BoundService(
  accessToken: string,
  refreshToken: string,
  serviceId: string,
  userProfileId: string
) {
  const providerTokenEnd = new Date();
  providerTokenEnd.setHours(providerTokenEnd.getHours() + 1);
  const timestampZProviderTokenEnd = providerTokenEnd.toISOString();

  const res = await adminSupabase.from("bound_services").upsert([
    {
      access_token: accessToken,
      refresh_token: refreshToken,
      service_id: serviceId,
      user_profile_id: userProfileId,
      expires_in: timestampZProviderTokenEnd,
    },
  ]);

  if (res.error) {
    return { data: null, error: res.error };
  }
  return { data: res.data, error: null };
}
