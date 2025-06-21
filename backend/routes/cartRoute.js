import express from 'express'
import { addToCart, updateCart, getCart } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router()

// Get cart data - GET request
cartRouter.get('/get', authUser, getCart)

// Add to cart - POST request
cartRouter.post('/add', authUser, addToCart)

// Update cart - POST request
cartRouter.post('/update', authUser, updateCart)


export default cartRouter