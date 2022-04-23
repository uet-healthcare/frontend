import Link from "next/link";
import { Fragment } from "react";
import { mainAPI } from "utils/axios";
import { getPostPath } from "utils/utils";

export default function UserProfile({ userMetadata, posts }) {
  return (
    <>
      <div className="flex items-baseline justify-between w-full max-w-screen-sm px-16 md:px-0 md:mx-auto">
        <div className="flex flex-wrap items-center gap-10 py-16 md:gap-16 font-body">
          <Link href={`/${userMetadata.username}`}>
            <a className="flex items-center gap-8">
              <div className="inline-flex items-center justify-center flex-shrink-0 w-32 h-32 mr-4 rounded-lg bg-rose-50 text-rose-800">
                {userMetadata.avatar_url ? (
                  <img
                    src={userMetadata.avatar_url}
                    className="w-32 h-32 rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  userMetadata.full_name?.[0]
                )}
              </div>
              <div className="text-lg font-bold text-gray-700 md:text-xl ">
                {userMetadata.full_name}
              </div>
            </a>
          </Link>

          <div className="text-gray-400">|</div>
          <Link href="/">
            <a>
              <div className="text-gray-400 hover:underline">vietlach.vn</div>
            </a>
          </Link>
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
                    <a className="">
                      <div className="text-xl font-bold text-gray-800 font-heading hover:underline">
                        {post.title}
                      </div>
                    </a>
                  </Link>
                  <div className="">{post.content}...</div>
                  <div className="flex items-center gap-16">
                    {/* <div className="bg-gray-200 w-36 h-36 rounded-xl" /> */}
                    <div className="flex flex-wrap items-center gap-10 text-sm text-gray-500">
                      <Link href={`/${post.author.username}`}>
                        <a className="hover:underline">
                          {post.author.full_name}
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

export async function getServerSideProps(context) {
  const { username } = context.query;
  const { data: userMetadata } = await mainAPI.get(
    `/public/users/metadata?username=${username}`
  );

  const { data: posts } = await mainAPI.get(
    `/public/posts?username=${username}`
  );

  return {
    props: {
      userMetadata: userMetadata || null,
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
