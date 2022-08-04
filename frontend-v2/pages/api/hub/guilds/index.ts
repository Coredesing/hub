import { fetcher } from '@/utils'
// import { GUILD_API_BASE_URL } from '@/utils/constants'
import qs from 'qs'
export const GUILD_API_BASE_URL = process.env.NEXT_GUILD_BASE_URL

export function fetchOneWithId (id) {
  const query = qs.stringify({
    populate: {
      projects: {
        populate: '*'
      },
      backers: {
        populate: '*'
      },
      members: {
        populate: '*'
      },
      ImageRepeater: {
        populate: 'image'
      },
      banner: {
        populate: '*'
      },
      logo: {
        populate: '*'
      },
      roadmapPicture: {
        populate: '*'
      },
      gallery: {
        populate: '*'
      }
    }
  }, {
    encodeValuesOnly: true
  })
  return fetcher(`${GUILD_API_BASE_URL}/guilds/${id}?${query}`)
}

export function fetchOneWithSlug (slug) {
  const query = qs.stringify({
    populate: ['projects', 'projects.communityOfficial', 'projects.banner', 'projects.logo', 'backers', 'members', 'members.avatar', 'logo', 'roadmapPicture', 'gallery', 'gallery.media']
  }, {
    encodeValuesOnly: true
  })
  return fetcher(`${GUILD_API_BASE_URL}/guilds?filters[slug][$eq]=${slug}&${query}`)
}

export function fetchTopSelected () {
  const query = qs.stringify({
    populate: {
      projects: {
        populate: ['banner', 'communityOfficial', 'logo']
      },
      ImageRepeater: {
        populate: 'image'
      },
      banner: {
        populate: '*'
      },
      logo: {
        populate: '*'
      }
    },
    sort: ['scholarship:desc']
  }, {
    encodeValuesOnly: true
  })
  return fetcher(`${GUILD_API_BASE_URL}/guilds?${query}&filters[topSelected][$eq]=true`)
}

export function fetchScholarshipPrograms () {
  const query = qs.stringify({
    populate: {
      project: {
        populate: '*'
      },
      banner: {
        populate: '*'
      },
      ImageRepeater: {
        populate: 'image'
      }
    }
  }, {
    encodeValuesOnly: true
  })
  return fetcher(`${GUILD_API_BASE_URL}/scholarship-programs?${query}`)
}
