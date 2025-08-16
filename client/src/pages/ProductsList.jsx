import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ProductsList = () => {
  const [products, setProducts] = useState([])
  const [showPopUp, setShowPopUp] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null) 
  const url=import.meta.env.VITE_BASE_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/api/food/getFoods`)
        setProducts(res.data)
      } catch (err) {
        toast.error(err.message)
      }
    }
    fetchData()
  }, [products])

  const onRemoveCartItem = (item) => {
    setProductToDelete(item) 
    setShowPopUp(true)       
  }

  const onDeleteProduct = async () => {
    try {
      const res=await axios.post(`${url}/api/food/removeFood`,{product_id:productToDelete.product_id})
      toast.success(`${res.data} deleted successfully`)
      setShowPopUp(false)
      setProductToDelete(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const onRemovePopup = () => {
    setShowPopUp(false)
    setProductToDelete(null)
  }

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Name</p>
          <p>Category</p>
          <p>Price</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {products.map(item => (
          <div key={item.product_id}>
            <div className="cart-items-title cart-items-item">
              <img src={item.image} alt="image" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <X
                onClick={() => onRemoveCartItem(item)}
                size={20}
                className="x-mark"
              />
            </div>
            <hr />
          </div>
        ))}
      </div>

      {showPopUp && (
        <div className="admin-popup">
          <p>Are you sure you want to delete {productToDelete?.name}?</p>
          <div className="popup-buttons">
            <button onClick={onDeleteProduct}>Delete</button>
            <button onClick={onRemovePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsList
