interface Credentials {
  t: string;
}

interface Params {
  userId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const create = async (
  params: Params,
  credentials: Credentials,
  post: FormData
) => {
  try {
    const response = await fetch(`${API_URL}/api/posts/new/${params.userId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: post,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const listNewsFeed = async (
  params: Params,
  credentials: Credentials,
  signal?: AbortSignal
) => {
  try {
    const response = await fetch(`${API_URL}/api/posts/feed/${params.userId}`, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const listByUser = async (
  params: Params,
  credentials: Credentials,
  signal?: AbortSignal
) => {
  try {
    const response = await fetch(`${API_URL}/api/posts/by/${params.userId}`, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const remove = async (
  params: { postId: string },
  credentials: Credentials
) => {
  try {
    const response = await fetch(`${API_URL}/api/posts/${params.postId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
