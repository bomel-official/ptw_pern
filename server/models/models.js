 const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    nickname: {type: DataTypes.STRING, allowNull: true, unique: true},
    avatar: {type: DataTypes.STRING, allowNull: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING, defaultValue: 'password'},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
    status: {type: DataTypes.STRING, defaultValue: 'FREE'},
    twitch: {type: DataTypes.STRING, allowNull: true},
    twitter: {type: DataTypes.STRING, allowNull: true},
    steam: {type: DataTypes.STRING, allowNull: true},
    vk: {type: DataTypes.STRING, allowNull: true},
    youtube: {type: DataTypes.STRING, allowNull: true},
    activisionId: {type: DataTypes.STRING, allowNull: true},
    discord_id: {type: DataTypes.STRING, allowNull: true},
    discord_username: {type: DataTypes.STRING, allowNull: true},
    discord_avatar: {type: DataTypes.STRING, allowNull: true},
    friends: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []},
    platform: {type: DataTypes.STRING, defaultValue: 'pc'},
    device: {type: DataTypes.STRING, defaultValue: 'km'},

    statsToursPlayed: {type: DataTypes.INTEGER, defaultValue: 0},
    statsToursList: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []},
    statsToursWon: {type: DataTypes.INTEGER, defaultValue: 0},
    statsToursTop3: {type: DataTypes.INTEGER, defaultValue: 0},
    statsAverageKills: {type: DataTypes.FLOAT, defaultValue: 0},
    statsAmountKills: {type: DataTypes.FLOAT, defaultValue: 0},

    // cart: Cart   ------------------ done
    // friends: User(Many)   ------------------ done
})

const FriendRequest = sequelize.define('friend_request', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    isAccepted: {type: DataTypes.BOOLEAN, defaultValue: false}
    // userFrom: User   ------------------ done
    // userTo: User   ------------------ done
})

const TeamRequest = sequelize.define('team_request', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // team: Team   ------------------ done
    // userTo: User   ------------------ done
})

const TournamentUser = sequelize.define('tournament_user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


const Tournament = sequelize.define('tournament', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title_RU: {type: DataTypes.STRING, allowNull: false},
    title_EU: {type: DataTypes.STRING, allowNull: false},
    slug: {type: DataTypes.STRING, allowNull: false},
    game: {type: DataTypes.STRING, allowNull: false},
    type: {type: DataTypes.STRING, defaultValue: 'tournament'},
    isRegisterOn: {type: DataTypes.BOOLEAN, defaultValue: true},
    twitchChannel: {type: DataTypes.STRING, allowNull: false},
    dateBegin: {type: DataTypes.DATE, allowNull: false},
    dateEnd: {type: DataTypes.DATE, allowNull: false},
    previewImg: {type: DataTypes.STRING, allowNull: true},
    maxUsers: {type: DataTypes.INTEGER, allowNull: false},
    playersInTeam: {type: DataTypes.INTEGER, allowNull: false},
    participationPrice: {type: DataTypes.FLOAT, defaultValue: 0},
    prizes: {type: DataTypes.INTEGER, allowNull: false},
    prize_1: {type: DataTypes.INTEGER, allowNull: false},
    prize_2: {type: DataTypes.INTEGER, allowNull: false},
    prize_3: {type: DataTypes.INTEGER, allowNull: false},
    descRules_RU: {type: DataTypes.TEXT, allowNull: false},
    descRules_EU: {type: DataTypes.TEXT, allowNull: false},
    descAdditional_RU: {type: DataTypes.TEXT, allowNull: false},
    descAdditional_EU: {type: DataTypes.TEXT, allowNull: false},
    format_RU: {type: DataTypes.STRING, allowNull: false},
    format_EU: {type: DataTypes.STRING, allowNull: false},
    participantsList: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []}
    // participants: User(Many)   ------------------ done
})

const Team = sequelize.define('team', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    slug: {type: DataTypes.STRING, allowNull: true},
    name: {type: DataTypes.STRING, allowNull: true},
    avatar: {type: DataTypes.STRING, allowNull: true},
    // requests: TeamRequest(Many)   ------------------ done
    // players: User(Many)   ------------------ done
    // capitan: User   ------------------ done
})

const Participant = sequelize.define('participant', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    points: {type: DataTypes.FLOAT, defaultValue: 0},
    dataArray: {type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.FLOAT)), defaultValue: [[]]},
    places: {type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.FLOAT)), defaultValue: []},
    isRoundsHidden: {type: DataTypes.ARRAY(DataTypes.BOOLEAN), defaultValue: []},
    roomNumber: {type: DataTypes.INTEGER, defaultValue: 0},
    invoiceUrl: {type: DataTypes.STRING, allowNull: true },
    payMethod: {type: DataTypes.STRING, defaultValue: 'paypal' },
    isPaid: {type: DataTypes.BOOLEAN, defaultValue: false},
    priority: {type: DataTypes.INTEGER, defaultValue: 0},
    // tournament: Tournament   ------------------ done
    // team: Team   ------------------ done
})

const ParticipantUser = sequelize.define('participant_user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    slug: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.FLOAT, allowNull: false},
    description: {type: DataTypes.FLOAT, allowNull: true}
    // productCat: productCat(Many)   ------------------ done
})

const ProductCat = sequelize.define('product_cat', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    slug: {type: DataTypes.STRING, allowNull: false}
})

const Build = sequelize.define('build', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: true},
    gameVersion: {type: DataTypes.STRING, allowNull: true},
    attachments: {type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.FLOAT)), defaultValue: []},
    likes: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []},
    likesCount: {type: DataTypes.INTEGER, defaultValue: 0},
})


const BuildWeapon = sequelize.define('build_weapon', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    gameVersion: {type: DataTypes.STRING, allowNull: true},
    title_RU: {type: DataTypes.STRING, allowNull: true},
    title_EU: {type: DataTypes.STRING, allowNull: true},
    image: {type: DataTypes.STRING, allowNull: true},
    allowedAttachments: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []}
})
const BuildWeaponType = sequelize.define('build_weapon_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title_RU: {type: DataTypes.STRING, allowNull: true},
    title_EU: {type: DataTypes.STRING, allowNull: true}
})
const BuildAttachment = sequelize.define('build_attachment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    gameVersion: {type: DataTypes.STRING, allowNull: true},
    title_RU: {type: DataTypes.STRING, allowNull: true},
    title_EU: {type: DataTypes.STRING, allowNull: true},
    image: {type: DataTypes.STRING, allowNull: true},
})
const BuildAttachmentType = sequelize.define('build_attachment_type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title_RU: {type: DataTypes.STRING, allowNull: true},
    title_EU: {type: DataTypes.STRING, allowNull: true}
})
const BuildMode = sequelize.define('build_mode', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    gameVersion: {type: DataTypes.STRING, allowNull: true},
    title_RU: {type: DataTypes.STRING, allowNull: true},
    title_EU: {type: DataTypes.STRING, allowNull: true}
})

const Question = sequelize.define('question', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    question_RU: {type: DataTypes.STRING, allowNull: true},
    question_EU: {type: DataTypes.STRING, allowNull: true},
    answer_RU: {type: DataTypes.TEXT, allowNull: true},
    answer_EU: {type: DataTypes.TEXT, allowNull: true}
})

BuildWeapon.hasMany(Build)
Build.belongsTo(BuildWeapon)
BuildWeaponType.hasMany(Build)
Build.belongsTo(BuildWeaponType)

BuildWeaponType.hasMany(BuildWeapon)
BuildWeapon.belongsTo(BuildWeaponType)

BuildAttachmentType.hasMany(BuildAttachment)
BuildAttachment.belongsTo(BuildAttachmentType)


const Invoice = sequelize.define('invoice', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    enotId: {type: DataTypes.STRING, allowNull: true},
    url: {type: DataTypes.STRING, allowNull: true},
    amount: {type: DataTypes.FLOAT, allowNull: false},
    currency: {type: DataTypes.STRING, defaultValue: 'EUR'},
    status: {type: DataTypes.STRING, defaultValue: 'created'},
    expired: {type: DataTypes.DATE, allowNull: true}
    // cart: Cart
    // products: Product(Many)
    // user: User
})


Participant.belongsTo(Invoice)
Invoice.belongsTo(Participant)

FriendRequest.belongsTo(User, {as: 'user_from'})
FriendRequest.belongsTo(User, {as: 'user_to'})

Tournament.belongsToMany(User, {as: 'players', through: 'tournament_user'})
User.belongsToMany(Tournament, {as: 'tournaments', through: 'tournament_user'})

Tournament.hasMany(Participant, {as: 'participants'})
Participant.belongsTo(Tournament)
Team.hasOne(Participant)
Participant.belongsTo(Team)

Participant.belongsToMany(User, {through: 'participant_user'})
User.belongsToMany(Participant, {through: 'participant_user'})

Team.belongsToMany(User, {as: 'players', through: 'team_request'})
User.belongsToMany(Team, {as: 'teams', through: 'team_request'})
Team.belongsTo(User, {as: 'capitan'})
User.hasMany(Team, {as: 'own_teams'})

ProductCat.hasMany(Product)
Product.belongsTo(ProductCat)

User.hasMany(Build)
Build.belongsTo(User)

module.exports = {
    User,
    Invoice,
    Build,
    ProductCat,
    Product,
    Participant,
    ParticipantUser,
    Team,
    Tournament,
    TeamRequest,
    FriendRequest,
    BuildWeapon,
    BuildWeaponType,
    BuildMode,
    BuildAttachment,
    BuildAttachmentType,
    Question,
    TournamentUser
}