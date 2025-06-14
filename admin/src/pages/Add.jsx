import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (index === 0) setImage1(file);
    if (index === 1) setImage2(file);
    if (index === 2) setImage3(file);
    if (index === 3) setImage4(file);
  };

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const onhandleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("quantity", quantity);
      formData.append("bestseller", bestseller.toString());
      formData.append("size", JSON.stringify(sizes));

      if (image1) formData.append("image1", image1);
      if (image2) formData.append("image2", image2);
      if (image3) formData.append("image3", image3);
      if (image4) formData.append("image4", image4);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: {
            token, // Let Axios set Content-Type
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setSubCategory("");
        setQuantity("");
        setBestseller(false);
        setSizes([]);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
      }
    } catch (error) {
      cconsole.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      toast.error(error.message);
    }
  };

  return (
    <div className="py-10 flex justify-center bg-white">
      <form
        onSubmit={onhandleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-lg"
      >
        {/* Image Upload */}
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[image1, image2, image3, image4].map((img, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  type="file"
                  accept="image/*"
                  id={`image${index}`}
                  hidden
                  onChange={(e) => handleImageChange(e, index)}
                />
                <img
                  className="max-w-24 cursor-pointer"
                  src={img ? URL.createObjectURL(img) : assets.upload_area}
                  alt="upload"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
          />
        </div>

        {/* Category */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Category</option>
            {["Men", "Women", "Kids"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="subcategory">
            Sub Category
          </label>
          <select
            id="subcategory"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
          >
            <option value="">Select Sub Category</option>
            {["Topwear", "Bottomwear", "Winterwear"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="flex-1 flex flex-col gap-1 w-32">
          <label className="text-base font-medium" htmlFor="product-price">
            Product Price
          </label>
          <input
            id="product-price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Quantity */}
        <div className="flex-1 flex flex-col gap-1 w-32">
          <label className="text-base font-medium" htmlFor="product-quantity">
            Quantity
          </label>
          <input
            id="product-quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="0"
            min="1"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            required
          />
        </div>

        {/* Sizes */}
        <div>
          <p className="mb-2">Product Sizes</p>
          <div className="flex gap-3 flex-wrap">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <p
                key={size}
                className={`px-3 py-1 cursor-pointer rounded ${
                  sizes.includes(size) ? "bg-black text-white" : "bg-slate-200"
                }`}
                onClick={() => toggleSize(size)}
              >
                {size}
              </p>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex gap-2 mt-2">
          <input
            type="checkbox"
            id="bestseller"
            checked={bestseller}
            onChange={() => setBestseller(prev => !prev)}
          />
          <label htmlFor="bestseller" className="cursor-pointer">
            Add to Bestseller
          </label>
        </div>

        {/* Submit */}
        <button
          className="px-8 py-2.5 bg-black text-white font-medium cursor-pointer rounded"
          type="submit"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
