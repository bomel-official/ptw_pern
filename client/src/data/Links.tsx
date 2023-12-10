import TrophyIcon from "../static/icons/trophy.svg";
import ShopIcon from "../static/icons/shopping-bag.svg";
import TrendUpIcon from "../static/icons/trending-up.svg";
import MailIcon from "../static/icons/mail.svg";
import PackagePlusIcon from "../static/icons/package-plus.svg";
import PackageOpenIcon from "../static/icons/package-open.svg";
import ArrowLeftRightIcon from "../static/icons/arrow-left-right.svg";

import DiscordIcon from "./../static/icons/discord-white.svg"
import TwitchIcon from "./../static/icons/twitch-white.svg"
import TwitterIcon from "./../static/icons/twitter.svg"
import YoutubeIcon from "./../static/icons/youtube-white.svg"

import ComponentIcon from "./../static/icons/component.svg"
import BarChartIcon from "./../static/icons/bar-chart-3.svg"
import UserPlusIcon from "./../static/icons/user-plus.svg"
import UserSettingsIcon from "./../static/icons/user-cog.svg"

export const adminMenuItem = {
    to: '/admin/tournaments',
    name: 'Админ-панель',
    icon: PackagePlusIcon
}

export const sideAdminMenuItems: Record<string, {to: string, icon: string, name: string, isMarginBottom: boolean}> = {
    '/admin/tournaments': {
        to: '/admin/tournaments',
        icon: TrophyIcon,
        name: 'Турниры',
        isMarginBottom: false
    },
    '/admin/builds': {
        to: '/admin/builds',
        icon: ComponentIcon,
        name: 'Мета сборки',
        isMarginBottom: false
    },
    '/admin/roles': {
        to: '/admin/roles',
        icon: UserSettingsIcon,
        name: 'Настройки доступа',
        isMarginBottom: true
    },
    '/admin/products': {
        to: '/admin/products',
        icon: PackageOpenIcon,
        name: 'Товары',
        isMarginBottom: false
    },
    '/admin/faq': {
        to: '/admin/faq',
        icon: ArrowLeftRightIcon,
        name: 'Вопросы и ответы',
        isMarginBottom: false
    },
}

export const menuItems = [
    {
        to: '/tournaments',
        name: 'Играть',
        icon: TrophyIcon
    },
    {
        to: '/shop',
        name: 'Магазин',
        icon: ShopIcon
    },
    {
        to: '/builds',
        name: 'Мета-сборки',
        icon: TrendUpIcon
    },
    {
        to: '/feedback',
        name: 'Обратная связь',
        icon: MailIcon
    },
]

export const socialItems = [
    {
        to: '/discord',
        icon: DiscordIcon,
        name: 'Discord',
        serviceUrl: 'https://discordapp.com/users/'
    },
    {
        to: '/twitch',
        icon: TwitchIcon,
        name: 'Twitch',
        serviceUrl: 'https://www.twitch.tv/'
    },
    {
        to: '/twitter',
        icon: TwitterIcon,
        name: 'Twitter',
        serviceUrl: 'https://twitter.com/'
    },
    {
        to: '/youtube',
        icon: YoutubeIcon,
        name: 'YouTube',
        serviceUrl: 'https://www.youtube.com/'
    }
]

export const socialObjects = {
    'discord': {
        to: '/discord',
        icon: DiscordIcon,
        name: 'Discord',
        serviceUrl: 'https://discordapp.com/users/'
    },
    'twitch': {
        to: '/twitch',
        icon: TwitchIcon,
        name: 'Twitch',
        serviceUrl: 'https://www.twitch.tv/'
    },
    'twitter': {
        to: '/twitter',
        icon: TwitterIcon,
        name: 'Twitter',
        serviceUrl: 'https://twitter.com/'
    },
    'youtube': {
        to: '/youtube',
        icon: YoutubeIcon,
        name: 'YouTube',
        serviceUrl: 'https://www.youtube.com/'
    }
}

export const sideMenuItems: Record<string, {to: string, icon: string, name: string, isMarginBottom: boolean}> = {
    '/tournaments' : {
        to: '/tournaments',
        icon: TrophyIcon,
        name: 'Турниры',
        isMarginBottom: false
    },
    '/hubs': {
        to: '/hubs',
        icon: ComponentIcon,
        name: 'Хабы',
        isMarginBottom: true
    },
    '/rating': {
        to: '/rating',
        icon: BarChartIcon,
        name: 'Общий рейтинг',
        isMarginBottom: false
    },
    '/teammate-search': {
        to: '/teammate-search',
        icon: UserPlusIcon,
        name: 'Поиск тиммейтов',
        isMarginBottom: false
    },
    '/builds': {
        to: '/builds',
        icon: TrendUpIcon,
        name: 'Мета-сборки',
        isMarginBottom: false
    }
}

export type ProfileTabsIds = 'general' | 'friends' | 'settings' | 'builds' | 'teams'
export const ProfileTabs: Record<ProfileTabsIds, {name: string, id: ProfileTabsIds} | null> = {
    'general': {
        name: 'Просмотр',
        id: 'general'
    },
    'friends': {
        name: 'Друзья',
        id: 'friends'
    },
    'teams': {
        name: 'Команды',
        id: 'teams'
    },
    'settings': {
        name: 'Настройка',
        id: 'settings'
    },
    'builds': {
        name: 'Мета-сборки',
        id: 'builds'
    }
}
export const ProfileViewTabs: Record<ProfileTabsIds, {name: string, id: ProfileTabsIds} | null> = {
    'general': {
        name: 'Просмотр',
        id: 'general'
    },
    'builds': {
        name: 'Мета-сборки',
        id: 'builds'
    },
    'friends': null,
    'teams': null,
    'settings': null,
}