interface Credentials {
  t: string;
}

interface Params {
  userId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const follow = async (
  params: Params,
  credentials: Credentials,
  followId: string
) => {
  try {
    const response = await fetch(`${API_URL}/api/users/follow`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: followId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const unfollow = async (
  params: Params,
  credentials: Credentials,
  unfollowId: string
) => {
  try {
    const response = await fetch(`${API_URL}/api/users/unfollow`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ userId: unfollowId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const findPeople = async (
  params: Params,
  credentials: Credentials,
  signal?: AbortSignal
) => {
  try {
    const response = await fetch(
      `${API_URL}/api/users/findpeople/${params.userId}`,
      {
        method: "GET",
        signal: signal,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + credentials.t,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
