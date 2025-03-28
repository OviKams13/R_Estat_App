import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const res = await apiRequest("/posts?" + query);
  return res.data;
};

export const profilePageLoader = async () => {
  const res = await apiRequest("/users/profilePosts");
  const reschat = await apiRequest("/chats");
  return {
    posts: res.data,
    chats: reschat.data
  };
};