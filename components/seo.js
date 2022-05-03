import Head from "next/head";
import { useRouter } from "next/router";
import { SITE_NAME, SITE_URL } from "utils/constants";

// export type CommonSEOProps = {
//   title: string,
//   description: string,
//   ogType: string,
//   ogImage: string,
//   noIndex?: boolean,
// };

export const CommonSEO = ({
  title,
  description,
  ogType,
  ogImage,
  noIndex,
  others,
}) => {
  const router = useRouter();

  return (
    <Head>
      <title>{title}</title>
      {noIndex ? (
        <>
          <meta name="robots" content="noindex" />
          <meta name="googlebot" content="noindex" />
        </>
      ) : (
        <meta name="robots" content="follow, index" />
      )}
      {description && <meta name="description" content={description} />}
      <meta property="og:url" content={`${SITE_URL}${router.asPath}`} />
      {ogType && <meta property="og:type" content={ogType} />}
      <meta property="og:site_name" content={SITE_NAME} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:title" content={title} />
      {ogImage && <meta property="og:image" content={ogImage} key={ogImage} />}
      {/* <meta name="twitter:card" content="summary_large_image" /> */}
      {/* <meta name="twitter:site" content={TWITTER_USER} /> */}
      {/* <meta name="twitter:creator" content={TWITTER_USER} /> */}
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {others &&
        others.map(({ name, content }) => (
          <meta key={name} name={name} content={content} />
        ))}
      <link rel="canonical" href={`${SITE_URL}${router.asPath}`} />
    </Head>
  );
};
