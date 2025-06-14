import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
  const { currency, getCartAmount, delivery_fee } = useContext(ShopContext)

  const subtotal = getCartAmount()
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee

  return (
    <div className="w-full p-4 rounded-lg shadow-sm border bg-white">
      <div className="text-2xl mb-4">
        <Title text1="CART" text2="TOTALS" />
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {subtotal.toFixed(2)}
          </p>
        </div>

        <div className="border-t" />

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee.toFixed(2)}
          </p>
        </div>

        <div className="border-t" />

        <div className="flex justify-between font-semibold text-base">
          <p>Total</p>
          <p>
            {currency} {total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal
