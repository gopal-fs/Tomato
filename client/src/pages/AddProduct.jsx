import React, { useRef, useState } from 'react';
import { assets } from '../assets/admin_assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddProduct = () => {
  const formData = useRef(new FormData());
  const formRef = useRef();
  const [previewImage, setPreviewImage] = useState(assets.upload_area);
  const url=import.meta.env.VITE_BASE_URL

  const onAddProduct = async(e) => {
    e.preventDefault();
  
    const finalProduct = {};
    for (let [key, value] of formData.current.entries()) {
      finalProduct[key] = value;
    }
  
    try {
      if (Object.keys(finalProduct).length > 0) {
        
        const formDataToSend = new FormData();
        for (let key in finalProduct) {
          formDataToSend.append(key, finalProduct[key]);
        }
  
        await axios.post(`${url}/api/food/addFood`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
  
        toast.success('Product Added');
      } else {
        toast.error('Please Add Product');
      }
    }
    catch(err) {
      console.log(err.message);
      toast.error("Error adding product");
    }
  
    formData.current = new FormData();
    formRef.current.reset();
    setPreviewImage(assets.upload_area); 
  };
  
  const onChangeProduct = (e) => {
    const { name, files, value } = e.target;

    if (files) {
      const file = files[0];
      formData.current.set(name, file);
      setPreviewImage(URL.createObjectURL(file)); 
    } else {
      formData.current.set(name, value);
    }
  };

  

  return (
    <div className='admin-add-product'>
      <p>Upload image</p>
      <form ref={formRef} onSubmit={onAddProduct} className='add-product-details'>
        <input
          name="image"
          onChange={onChangeProduct}
          type='file'
          accept='image/*'
          id="productImage"
          required
          style={{
            opacity: 0,
            position: "absolute",
            zIndex: -1
          }}
        />
        <label htmlFor='productImage'>
          <img src={previewImage} alt='upload' className='admin-upload'/>
        </label>

        <label>Product Name</label>
        <input name='name' onChange={onChangeProduct} type='text' placeholder='Type here' required/>

        <label>Product Description</label>
        <textarea name='description' onChange={onChangeProduct} rows={6} cols={36} placeholder='Write content here' required></textarea>

        <div className='admin-items'>
          <div>
            <label>Product Category</label>
            <br />
            <select name='category' required onChange={onChangeProduct}>
              <option>Salad</option>
              <option>Rolls</option>
              <option>Deserts</option>
              <option>Sandwitch</option>
              <option>Cake</option>
              <option>Pure Veg</option>
              <option>Pasta</option>
              <option>Noodles</option>
            </select>
          </div>

          <div>
            <label>Product Price</label>
            <br />
            <input name='price' onChange={onChangeProduct} required className='price' placeholder='Type..' type='number' />
          </div>
        </div>

        <button>Add</button>
      </form>
    </div>
  );
};

export default AddProduct;
