const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
const authRouter = require('./authRouter')
const buildRouter = require('./buildRouter')
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')
const productRouter = require('./productRouter')
const teamRouter = require('./teamRouter')
const tournamentRouter = require('./tournamentRouter')
const friendsRouter = require('./friendsRouter')


router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/build', buildRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)
router.use('/product', productRouter)
router.use('/team', teamRouter)
router.use('/tournament', tournamentRouter)
router.use('/friend', friendsRouter)


module.exports = router