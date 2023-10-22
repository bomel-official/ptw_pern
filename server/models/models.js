 const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    nickname: {type: DataTypes.STRING, allowNull: true},
    avatar: {type: DataTypes.STRING, allowNull: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING, defaultValue: 'password'},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
    status: {type: DataTypes.STRING, defaultValue: 'FREE'},
    twitch: {type: DataTypes.STRING, allowNull: true},
    steam: {type: DataTypes.STRING, allowNull: true},
    vk: {type: DataTypes.STRING, allowNull: true},
    youtube: {type: DataTypes.STRING, allowNull: true},
    activisionId: {type: DataTypes.STRING, allowNull: true},
    discord: {type: DataTypes.STRING, allowNull: true},
    toursPlayed: {type: DataTypes.INTEGER, allowNull: true},
    averagePlace: {type: DataTypes.FLOAT, allowNull: true},
    bestPlace: {type: DataTypes.INTEGER, allowNull: true},
    friends: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []}
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
    isAccepted: {type: DataTypes.BOOLEAN, defaultValue: false}
    // team: Team   ------------------ done
    // userTo: User   ------------------ done
})

const Tournament = sequelize.define('tournament', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title_RU: {type: DataTypes.STRING, allowNull: false},
    title_EU: {type: DataTypes.STRING, allowNull: false},
    slug: {type: DataTypes.STRING, allowNull: false},
    isRegisterOn: {type: DataTypes.BOOLEAN, defaultValue: true},
    twitchChannel: {type: DataTypes.STRING, allowNull: false},
    dateBegin: {type: DataTypes.DATE, allowNull: false},
    dateEnd: {type: DataTypes.DATE, allowNull: false},
    previewImg: {type: DataTypes.STRING, allowNull: false},
    maxUsers: {type: DataTypes.INTEGER, allowNull: false},
    playersInTeam: {type: DataTypes.INTEGER, allowNull: false},
    participationPrice: {type: DataTypes.FLOAT, defaultValue: 0},
    prizeFund: {type: DataTypes.STRING, allowNull: false},
    descFormat_RU: {type: DataTypes.STRING, allowNull: false},
    descFormat_EU: {type: DataTypes.STRING, allowNull: false},
    descPrizes_RU: {type: DataTypes.STRING, allowNull: false},
    descPrizes_EU: {type: DataTypes.STRING, allowNull: false},
    descFaq_RU: {type: DataTypes.STRING, allowNull: false},
    descFaq_EU: {type: DataTypes.STRING, allowNull: false},
    descRules_RU: {type: DataTypes.STRING, allowNull: false},
    descRules_EU: {type: DataTypes.STRING, allowNull: false},
    // participants: User(Many)   ------------------ done
})

const Team = sequelize.define('team', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    slug: {type: DataTypes.STRING, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: true},
    // requests: TeamRequest(Many)   ------------------ done
    // players: User(Many)   ------------------ done
    // capitan: User   ------------------ done
})

const Participant = sequelize.define('participant', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    points: {type: DataTypes.INTEGER, defaultValue: 0},
    points1r: {type: DataTypes.INTEGER, defaultValue: 0},
    points2r: {type: DataTypes.INTEGER, defaultValue: 0},
    points3r: {type: DataTypes.INTEGER, defaultValue: 0},
    points4r: {type: DataTypes.INTEGER, defaultValue: 0},
    points5r: {type: DataTypes.INTEGER, defaultValue: 0},
    ptsForPlace1r: {type: DataTypes.INTEGER, defaultValue: 0},
    ptsForPlace2r: {type: DataTypes.INTEGER, defaultValue: 0},
    ptsForPlace3r: {type: DataTypes.INTEGER, defaultValue: 0},
    ptsForPlace4r: {type: DataTypes.INTEGER, defaultValue: 0},
    ptsForPlace5r: {type: DataTypes.INTEGER, defaultValue: 0},
    hide1r: {type: DataTypes.BOOLEAN, defaultValue: false},
    hide2r: {type: DataTypes.BOOLEAN, defaultValue: false},
    hide3r: {type: DataTypes.BOOLEAN, defaultValue: false},
    hide4r: {type: DataTypes.BOOLEAN, defaultValue: false},
    hide5r: {type: DataTypes.BOOLEAN, defaultValue: false}
    // playerResults: PlayerResult(Many)   ------------------ done
    // tournament: Tournament   ------------------ done
    // team: Team   ------------------ done
})

const PlayerResult = sequelize.define('player_result', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    kills1r: {type: DataTypes.INTEGER, defaultValue: 0},
    kills2r: {type: DataTypes.INTEGER, defaultValue: 0},
    kills3r: {type: DataTypes.INTEGER, defaultValue: 0},
    kills4r: {type: DataTypes.INTEGER, defaultValue: 0},
    kills5r: {type: DataTypes.INTEGER, defaultValue: 0}
    // user: User
    // participant: Participant
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
    // ... todo
    // user: User   ------------------ done
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    isPaid: {type: DataTypes.BOOLEAN, defaultValue: false}
    // cart: Cart
    // products: Product(Many)
    // user: User
})

const Cart = sequelize.define('cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    // products: Product(Many)   ------------------ done
    // user: User   ------------------ done
})

const ProductCart = sequelize.define('product_cart', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const ProductOrder = sequelize.define('product_order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

Cart.hasOne(User)
Cart.belongsTo(User)

Cart.belongsToMany(Product, {through: 'product_cart'})
Product.belongsToMany(Cart, {through: 'product_cart'})

FriendRequest.belongsTo(User, {as: 'user_from'})
User.hasOne(FriendRequest, {as: 'user_to'})

Team.hasMany(TeamRequest)
TeamRequest.belongsTo(Team)
User.hasOne(TeamRequest)

Tournament.hasMany(Participant, {as: 'participants'})
Tournament.hasMany(PlayerResult, {as: 'playerResults'})
Participant.belongsTo(Tournament)
Team.hasOne(Participant)
Participant.belongsTo(Team)
Participant.hasMany(PlayerResult)
PlayerResult.belongsTo(Participant)
PlayerResult.belongsTo(Tournament)

ProductCat.hasMany(Product)
Product.belongsTo(ProductCat)

User.hasMany(Build)
Build.belongsTo(User)

Cart.hasOne(Order)
Order.belongsToMany(Product, {through: 'product_order'})
Product.belongsToMany(Order, {through: 'product_order'})

User.hasMany(Order)
Order.belongsTo(User)

module.exports = {
    User,
    ProductCart,
    Cart,
    Order,
    Build,
    ProductCat,
    Product,
    PlayerResult,
    Participant,
    Team,
    Tournament,
    TeamRequest,
    FriendRequest,
    ProductOrder
}