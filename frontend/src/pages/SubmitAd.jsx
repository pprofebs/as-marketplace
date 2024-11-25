import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./Login";
import GenericInput from "../components/features/Input/GenericInput";
import GenericSelect from "../components/features/Select/GenericSelect";
import DescriptionTextarea from "../components/features/Textarea/DescriptionTextArea"; // Corrected import path
import ImageUpload from "../components/features/Form/ImageUpload";

const SubmitAd = () => {
  // Destructure the context object to access token
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    title: "",
    description: "",
    price: "",
    condition: "",
    mainCategory: "",
    subCategory: "",
    images: [],
  });
  const [categories, setCategories] = useState({});
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/categories");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
        setMainCategoryOptions(
          Object.keys(data).map((category) => ({
            label: category,
            value: category,
          }))
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(`Error: ${error.message}`);
      }
    };

    fetchCategories();
  }, []);

  const handleMainCategoryChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, mainCategory: value, subCategory: "" });
    setSubCategoryOptions(
      categories[value].map((sub) => ({ label: sub, value: sub }))
    );
  };

  const handleSubCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(
      0,
      5 - formData.images.length
    );
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...files] });
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        if (key === "images") {
          formData[key].forEach((file) => {
            formDataToSend.append("images", file);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/ads/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });
      console.log(formDataToSend)
      if (response.ok) {
        const data = await response.json();
        toast.success('Sikeres hirdetésfeladás!')
        console.log("Ad created:", data);
        navigate("/en");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Ad creation error:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleFileRemove = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const conditionOptions = [
    { label: "Új", value: "new" },
    { label: "Nagyon jó", value: "very_good" },
    { label: "Jó", value: "good" },
    { label: "Elfogadható", value: "fair" },
    {
      label: "Alkatrészeknek vagy nem működő",
      value: "for_parts_or_not_working",
    },
  ];

  return (
    <div>
      {!token ? (
        <LoginPage />
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-16">
          <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Készítsd el a hirdetésed
            </h2>

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              method="post"
            >
              {/* Airsoft Replica Details */}
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Hirdetés részletei
                </p>
                <div className="grid grid-cols-1 gap-4">
                  <GenericInput
                    type="text"
                    name="title"
                    id="title"
                    placeholder="A hirdetésed címe"
                    handleChange={handleChange}
                  />
                  <DescriptionTextarea
                    name="description"
                    id="description"
                    placeholder="Leírás"
                    handleChange={handleDescriptionChange}
                    value={formData.description}
                  />
                  <GenericInput
                    type="text"
                    name="price"
                    id="price"
                    placeholder="Ár"
                    handleChange={handleChange}
                  />
                  <GenericSelect
                    name="condition"
                    id="condition"
                    options={conditionOptions}
                    placeholder="Válassz kondíciót"
                    handleChange={handleChange}
                  />
                  <GenericSelect
                    name="mainCategory"
                    id="mainCategory"
                    options={mainCategoryOptions}
                    placeholder="Válassz fő kategóriát"
                    handleChange={handleMainCategoryChange}
                  />
                  <GenericSelect
                    name="subCategory"
                    id="subCategory"
                    options={subCategoryOptions}
                    placeholder="Válassz alkategóriát"
                    handleChange={handleSubCategoryChange}
                  />
                </div>
                <div className="mt-4">
                  <ImageUpload
                    handleFileChange={handleFileChange}
                    imagePreviews={imagePreviews}
                    handleFileRemove={handleFileRemove}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full"
                >
                  Küldés
                </button>
              </div>
            </form>
            <ToastContainer />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitAd;
