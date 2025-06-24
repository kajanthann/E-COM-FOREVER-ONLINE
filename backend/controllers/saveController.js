import userModel from "../models/userModel.js"


const addToSaved = async (req, res) => {
    try {
        const { productId } = req.body
        await userModel.findById(req.user._id)

        user.savedProducts.push(productId)
        await user.save()

        res.json({ success: true, message: "Product saved successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const removeFromSaved = async (req, res) => {
    try {
        const { productId } = req.body
        await userModel.findById(req.user._id)

        user.savedProducts.pull(productId)
        await user.save()

        res.json({ success: true, message: "Product removed from saved" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

const listSaved = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        res.json({ success: true, savedProducts: user.savedProducts })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { addToSaved, removeFromSaved, listSaved }