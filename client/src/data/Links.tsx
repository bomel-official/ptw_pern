import ArrowLeftRightIcon from "../static/icons/arrow-left-right.svg";
import MailIcon from "../static/icons/mail.svg";
import PackagePlusIcon from "../static/icons/package-plus.svg";
import TargetIcon from "../static/icons/target.svg";
import TrendUpIcon from "../static/icons/trending-up.svg";
import TrophyIcon from "../static/icons/trophy.svg";

import ComponentIcon from "./../static/icons/component.svg";

import DiscordIcon from "./../static/icons/discord-white.svg";
import TwitchIcon from "./../static/icons/twitch-white.svg";
import TwitterIcon from "./../static/icons/twitter.svg";
import UserSettingsIcon from "./../static/icons/user-cog.svg";
import UserPlusIcon from "./../static/icons/user-plus.svg";
import YoutubeIcon from "./../static/icons/youtube-white.svg";

export const adminMenuItem = {
    to: "/admin/tournaments",
    name: "Админ-панель",
    icon: PackagePlusIcon
};

export const sideAdminMenuItems: Record<string, { to: string, icon: string, name: string, isMarginBottom: boolean }> = {
    "/admin/tournaments": {
        to: "/admin/tournaments",
        icon: TrophyIcon,
        name: "Турниры",
        isMarginBottom: false
    },
    "/admin/builds": {
        to: "/admin/builds",
        icon: ComponentIcon,
        name: "Мета сборки",
        isMarginBottom: false
    },
    "/admin/roles": {
        to: "/admin/roles",
        icon: UserSettingsIcon,
        name: "Настройки доступа",
        isMarginBottom: true
    },
    // '/admin/products': {
    //     to: '/admin/products',
    //     icon: PackageOpenIcon,
    //     name: 'Товары',
    //     isMarginBottom: false
    // },
    "/admin/faq": {
        to: "/admin/faq",
        icon: ArrowLeftRightIcon,
        name: "Вопросы и ответы",
        isMarginBottom: false
    },
};

export const menuItems = [
    {
        to: "/tournaments",
        name: "Играть",
        icon: TrophyIcon,
        games: [ "warzone", "dota2" ]
    },
    {
        to: "/competition",
        name: "Турниры сообщества",
        icon: ComponentIcon,
        games: [ "warzone", "dota2" ]
    },
    // {
    //     to: "/shop",
    //     name: "Магазин",
    //     icon: ShopIcon
    // },
    {
        to: "/builds",
        name: "Мета-сборки",
        icon: TrendUpIcon,
        games: [ "warzone" ]
    },
    {
        to: "/feedback",
        name: "FAQ",
        icon: MailIcon,
        games: [ "warzone", "dota2" ]
    },
    {
        to: "/fortune-wheel",
        name: "Колесо фортуны",
        icon: TargetIcon,
        games: [ "warzone", "dota2" ]
    },
];

export const footerMenuItems = [
    {
        to: "/privacy",
        name: "Политика конфиденциальности"
    },
    {
        to: "/user-rules",
        name: "Условия пользования"
    },
    {
        to: "/contact",
        name: "Контакты"
    }
];

export const socialItems = [
    {
        to: process.env.REACT_APP_DISCORD_LINK_URL || "/",
        icon: DiscordIcon,
        name: "Discord",
        serviceUrl: "https://discordapp.com/users/"
    },
    {
        to: process.env.REACT_APP_TWITCH_LINK_URL || "/",
        icon: TwitchIcon,
        name: "Twitch",
        serviceUrl: "https://www.twitch.tv/"
    },
    {
        to: process.env.REACT_APP_TWITTER_LINK_URL || "/",
        icon: TwitterIcon,
        name: "Twitter",
        serviceUrl: "https://twitter.com/"
    },
    {
        to: process.env.REACT_APP_YOUTUBE_LINK_URL || "/",
        icon: YoutubeIcon,
        name: "YouTube",
        serviceUrl: "https://www.youtube.com/"
    }
];

export const socialObjects = {
    "discord": {
        to: process.env.REACT_APP_DISCORD_LINK_URL || "/",
        icon: DiscordIcon,
        name: "Discord",
        serviceUrl: "https://discordapp.com/users/"
    },
    "twitch": {
        to: process.env.REACT_APP_TWITCH_LINK_URL || "/",
        icon: TwitchIcon,
        name: "Twitch",
        serviceUrl: "https://www.twitch.tv/"
    },
    "twitter": {
        to: process.env.REACT_APP_TWITTER_LINK_URL || "/",
        icon: TwitterIcon,
        name: "Twitter",
        serviceUrl: "https://twitter.com/"
    },
    "youtube": {
        to: process.env.REACT_APP_YOUTUBE_LINK_URL || "/",
        icon: YoutubeIcon,
        name: "YouTube",
        serviceUrl: "https://www.youtube.com/"
    }
};

export const sideMenuItems: Record<string, { to: string, icon: string, name: string, isMarginBottom: boolean }> = {
    "/tournaments": {
        to: "/tournaments",
        icon: TrophyIcon,
        name: "Турниры",
        isMarginBottom: false
    },
    "/competition": {
        to: "/competition",
        icon: ComponentIcon,
        name: "Турниры сообщества",
        isMarginBottom: true
    },
    // '/rating': {
    //     to: '/rating',
    //     icon: BarChartIcon,
    //     name: 'Общий рейтинг',
    //     isMarginBottom: false
    // },
    "/teammate-search": {
        to: "/teammate-search",
        icon: UserPlusIcon,
        name: "Поиск тиммейтов",
        isMarginBottom: false
    },
    "/builds": {
        to: "/builds",
        icon: TrendUpIcon,
        name: "Мета-сборки",
        isMarginBottom: false
    }
};

export type ProfileTabsIds = "general" | "friends" | "settings" | "builds" | "teams"
export const ProfileTabs: Record<ProfileTabsIds, { name: string, id: ProfileTabsIds } | null> = {
    "general": {
        name: "Просмотр",
        id: "general"
    },
    "friends": {
        name: "Друзья",
        id: "friends"
    },
    "teams": {
        name: "Команды",
        id: "teams"
    },
    "settings": {
        name: "Настройка",
        id: "settings"
    },
    "builds": {
        name: "Мета-сборки",
        id: "builds"
    }
};
export const ProfileViewTabs: Record<ProfileTabsIds, { name: string, id: ProfileTabsIds } | null> = {
    "general": {
        name: "Просмотр",
        id: "general"
    },
    "builds": {
        name: "Мета-сборки",
        id: "builds"
    },
    "friends": null,
    "teams": null,
    "settings": null,
};
