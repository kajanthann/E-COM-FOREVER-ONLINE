import express from 'express'
import { addToSaved, listSaved, removeFromSaved } from '../controllers/saveController.js'
import authUser from '../middleware/auth.js'

const savedRouter = express.Router()

savedRouter.post('/add',authUser,addToSaved)
savedRouter.post('/remove',authUser,removeFromSaved)
savedRouter.get('/list',authUser,listSaved)

export default savedRouter

