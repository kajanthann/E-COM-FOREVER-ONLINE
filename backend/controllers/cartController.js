import userModel from "../models/userModel.js";


// Add product to user cart
const addToCart = async (req, res) => {
  try {
    const { userId,itemId, size } = req.body;

    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Product ID and size are required"
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    let cartData = userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }


    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ 
      success: true, 
      message: "added to cart" 
    });

  } catch (error) {
    console.log('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add product to cart" 
    });
  }
};

// Update product quantity in user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID, size, and quantity are required"
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    let cartData = await userData.cartData;

    // Update quantity
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }


    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ 
      success: true, 
      message: "Cart updated",
      cartData 
    });
  } catch (error) {
    console.log('Update cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update cart" 
    });
  }
};

// Get user cart data
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);

    let cartData = await userData.cartData;

    if (!userData) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      cartData 
    });

  } catch (error) {
    console.log('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch cart data" 
    });
  }
};

// delete cart
const deleteFromCart = async (req, res) => {
  try {
    const { userId,itemId, size } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (size && cartData[itemId]) {
      // Remove only specific size
      delete cartData[itemId][size];

      // If no sizes left, remove the whole product
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      // Remove entire product if size not specified
      delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Item removed from cart", cartData });
  } catch (error) {
    console.log('Delete from cart error:', error);
    res.status(500).json({ success: false, message: "Failed to delete from cart" });
  }
};


export { addToCart, updateCart, getCart, deleteFromCart };
