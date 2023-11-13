export const getSocialLink = (link: string, type: 'twitch' | 'youtube' | 'discord' | 'twitter' = 'twitch'): string => {
    switch (type){
        case "discord":
            return link
        case "twitch":
            return `https://twitch.com/${link}`
        case "youtube":
            return `https://youtube.com/${link}`
        case "twitter":
            return `https://twitter.com/${link}`
    }
    return ''
};