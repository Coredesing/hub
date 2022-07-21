import { useState, useEffect } from 'react'
import Image from 'next/image'

const ReviewAvatar = ({ url, size = 64, ...res }) => {
  const [avatarUrl, setAvatarUrl] = useState(url)

  useEffect(() => {
    setAvatarUrl(url)
  }, [url])

  const handleOnError = () => {
    setAvatarUrl('/defaultAvatar.png')
  }

  return (
    <Image width={size} height={size} src={avatarUrl || require('@/assets/images/avatar2.png')} alt="avatar" onError={handleOnError} {...res} />
  )
}

export default ReviewAvatar
