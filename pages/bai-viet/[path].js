import PostBody from "components/post-body";
import { useRouter } from "next/router";
import { getPostIDFromPath } from "utils/utils";
import { mainAPI } from "utils/axios";
import Head from "next/head";
import Link from "next/link";

export default function PostDetail({ post }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <div className="max-w-screen-sm pt-32 pb-64 mx-16 space-y-16 leading-relaxed text-gray-900 md:mx-auto md:text-lg md:space-y-24">
        <div className="flex items-center gap-16 text-gray-400">
          <button
            className="text-xl hover:text-gray-600"
            onClick={() => router.back()}
          >
            &larr;
          </button>
          <Link href="/">
            <a className="font-bold hover:text-gray-600">vietlach.vn</a>
          </Link>
        </div>
        <h1 className="text-xl font-bold text-gray-800 font-heading md:text-3xl md:leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-16">
          {/* <div className="bg-gray-200 w-36 h-36 md:w-40 md:h-40 rounded-xl" /> */}
          <div className="flex flex-wrap items-center gap-20 text-sm text-gray-600 gap-y-8 sm:gap-10">
            <Link href={`/${post.author.username}`}>
              <a className="flex items-center gap-10">
                <div className="inline-flex items-center justify-center flex-shrink-0 w-32 h-32 rounded-lg bg-rose-50 text-rose-800">
                  {post?.author?.avatar_url ? (
                    // eslint-disable-next-line
                    <img
                      src={post?.author?.avatar_url}
                      className="w-32 h-32 rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : post?.author?.full_name ? (
                    [0]
                  ) : (
                    ""
                  )}
                </div>
                <div className="hover:underline">{post?.author?.full_name}</div>
              </a>
            </Link>
            <div>&#183;</div>
            <div>{post.created_time}</div>
          </div>
        </div>
        <PostBody>{post.content}</PostBody>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const postID = getPostIDFromPath(context.query.path);
  const response = await mainAPI.get(`/public/posts?id=${postID}`);
  const [post] = response.data;

  return {
    props: {
      post: post
        ? {
            ...post,
            created_time: Intl.DateTimeFormat("vi-VN", {
              dateStyle: "full",
            }).format(new Date(post.created_time)),
          }
        : null,
    },
  };
}
