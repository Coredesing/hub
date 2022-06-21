import { useCallback, useMemo } from 'react'

const TwitterParser = (props) => {
  const post = props.children
  const REGEX_URL = useMemo(() => (/(?:\s)(f|ht)tps?:\/\/([^\s\t\r\n<]*[^\s\t\r\n<)*_,.])/g), []) // regex for urls
  const REGEX_USER = useMemo(() => (/\B@([a-zA-Z0-9_]+)/g), []) // regex for @users
  const REGEX_HASHTAG = useMemo(() => (/\B(#[Ã¡-ÃºÃ-ÃÃ¤-Ã¼Ã-Ãa-zA-Z0-9_]+)/g), []) // regex for #hashtags

  const parsedTweet = useCallback(() => {
    let html = post
    if (!html) return ''
    html = html.replace(REGEX_URL, (url) => {
      return url.replace(url, `<a href="${url}" target="_blank" rel="noreferer noopener noreferrer">${url}</a>`)
    })
    html = html.replace(REGEX_USER, (user) => {
      const userOnly = user.slice(1)
      const url = `http://twitter.com/${userOnly}`
      const link = `<a href="${url}" target="_blank" rel="noreferer noopener noreferrer">@${userOnly}</a>`
      return link
    })
    html = html.replace(REGEX_HASHTAG, (hashtag) => {
      const hashtagOnly = hashtag.slice(1)
      const url = `https://twitter.com/hashtag/${hashtagOnly}`
      const link = `<a href="${url}" target="_blank" rel="noreferer noopener noreferrer">#${hashtagOnly}</a>`
      return hashtag.replace(hashtag, link)
    })

    return html
  }, [REGEX_HASHTAG, REGEX_URL, REGEX_USER, post])

  return <div className="feed" dangerouslySetInnerHTML={{ __html: parsedTweet() }}></div>
}

export default TwitterParser
