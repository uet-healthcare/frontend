import AvatarDropdown from "components/header-avatar-dropdown";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { auth } from "utils/auth";
import { mainAPI } from "utils/axios";
import { getPostPath } from "utils/utils";

const POSTS_PER_PAGE = 10;

export default function Home({ posts: initialPosts }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState(initialPosts);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isNoMorePosts, setIsNoMorePosts] = useState(false);

  useEffect(() => {
    setCurrentUser(auth.currentUser());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight
      ) {
        setIsLoadMore(true);
      }
    };
    window.addEventListener("scroll", handleScroll, false);

    return () => window.removeEventListener("scroll", handleScroll, false);
  }, [setIsLoadMore]);

  useEffect(() => {
    if (isLoading || !isLoadMore || isNoMorePosts) return;
    setIsLoading(true);
    mainAPI
      .get(`/public/posts?offset=${posts.length}&limit=${POSTS_PER_PAGE}`)
      .then((response) => {
        if (response.status === 200 && response.data && response.data.length) {
          const responsePosts = response.data.map((post) => ({
            ...post,
            created_time: Intl.DateTimeFormat("vi-VN", {
              dateStyle: "long",
            }).format(new Date(post.created_time)),
          }));

          setPosts((prevState) => [...prevState, ...responsePosts]);
          setIsLoadMore(false);
          if (responsePosts.length < POSTS_PER_PAGE) {
            setIsNoMorePosts(true);
          }
        }
      })
      .catch((error) => console.error(error))
      .then(() => {
        setIsLoading(false);
      });
  }, [isLoadMore, posts.length, setPosts, isLoading]);

  return (
    <>
      <div className="flex items-baseline justify-between w-full max-w-screen-sm px-16 md:px-0 md:mx-auto">
        <Link href="/">
          <a className="py-12 text-xl font-bold font-body">
            <span className="text-gray-700">vietlach</span>
            <span className="text-rose-400">.vn</span>
          </a>
        </Link>
        <div className="flex items-center gap-12 text-sm text-gray-600">
          <Link href={currentUser ? "/viet-bai" : "/dang-nhap"}>
            <a className="hover:text-gray-900">
              {currentUser ? "Viết bài" : "Đăng nhập"}
            </a>
          </Link>
          {currentUser && <AvatarDropdown />}
        </div>
      </div>
      <hr />
      <div className="max-w-screen-sm mx-16 space-y-16 leading-relaxed text-gray-900 md:mx-auto md:text-lg md:space-y-24">
        <div className="flex flex-col divide-y md:mt-12">
          {posts &&
            posts.map((post) => (
              <Fragment key={post.post_id}>
                <div className="flex flex-col gap-16 py-32">
                  <Link href={getPostPath(post.post_id, post.title)}>
                    <a>
                      <div className="text-xl font-bold text-gray-800 font-heading hover:underline">
                        {post.title}
                      </div>
                    </a>
                  </Link>
                  <div className="text-base">{post.content}...</div>
                  <div className="flex items-center gap-16">
                    <div className="flex flex-wrap items-center gap-10 text-sm text-gray-500">
                      <Link href={`/${post.author.username}`}>
                        <a className="flex items-center gap-10 group">
                          <div className="inline-flex items-center justify-center flex-shrink-0 w-32 h-32 rounded-lg bg-rose-50 text-rose-800">
                            {post.author.avatar_url ? (
                              // eslint-disable-next-line
                              <img
                                src={post.author.avatar_url}
                                className="w-32 h-32 rounded-lg"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              post.author.full_name?.[0]
                            )}
                          </div>
                          <div className="group-hover:underline">
                            {post.author.full_name}
                          </div>
                        </a>
                      </Link>
                      <div>&#183;</div>
                      <div>{post.created_time}</div>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const limit = 10;
  const { data: posts } = await mainAPI.get(`/public/posts?limit=${limit}`);

  return {
    props: {
      posts: posts
        ? posts.map((el) => ({
            ...el,
            created_time: Intl.DateTimeFormat("vi-VN", {
              dateStyle: "long",
            }).format(new Date(el.created_time)),
          }))
        : null,
    },
  };
}
