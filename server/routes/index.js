const express = require('express')
const router = express.Router()
const userRouter = require('./userRouter')
const buildRouter = require('./buildRouter')
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')
const productRouter = require('./productRouter')
const teamRouter = require('./teamRouter')
const tournamentRouter = require('./tournamentRouter')


router.use('/user', userRouter)
router.use('/build', buildRouter)
router.use('/cart', cartRouter)
router.use('/order', orderRouter)
router.use('/product', productRouter)
router.use('/team', teamRouter)
router.use('/tournament', tournamentRouter)


module.exports = router