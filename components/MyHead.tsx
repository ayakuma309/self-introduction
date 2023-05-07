import type { NextPage } from 'next'
import Head from 'next/head'

interface MyHeadProps {
  title?: string
  thumbnailUrl?: string
  description?: string
}

const MyHead: NextPage<MyHeadProps> = ({title, thumbnailUrl, description}) => {
  const siteName = "わたしについて"
  if (title === undefined) {
    title = siteName
  } else {
    title = `${title} - ${siteName}`
  }

  if (thumbnailUrl === undefined) {
    thumbnailUrl = 'https://self-introduction-aboutme.vercel.app/ogp.png';
  }

  if (description === undefined) {
    description = "よろしくお願いします。"
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" property="og:title" content={title}/>
      <meta property="og:image" content={thumbnailUrl}/>
      <meta property="og:description" content={description}/>
      <meta
        name="twitter:card"
        key="twitterCard"
        content="summary_large_image"
      />
      <meta
        name="twitter:image"
        key="twitterImage"
        content={thumbnailUrl}
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  )
}

export default MyHead
