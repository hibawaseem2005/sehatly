import React, { useState, useRef } from "react";
import { Plus, ChevronDown } from "lucide-react";
import "../designs/AddMedicine.css";

const AddMedicine = () => {
  const categories = {
    "Pain Relief": "650000000000000000000004",
    Antibiotics: "650000000000000000000006",
    Fever: "650000000000000000000007",
    Allergy: "650000000000000000000008",
    Diabetes: "650000000000000000000009",
    "Anti Depressants": "650000000000000000000010",
    Hypertension: "650000000000000000000011",
    Asthma: "650000000000000000000012",
    Antifungal: "650000000000000000000013",
    Vaccines: "650000000000000000000014",
  };

  const [recentlyAdded, setRecentlyAdded] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    category_id: "",
    price: "",
    discount: "",
    stockQuantity: "",
    req_prescription: false,
    imageFile: null,
    imagePreview: null,
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: e.target.result, // base64 (no blob error)
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id) {
      alert("Please select a category!");
      return;
    }

    try {
      const token = localStorage.getItem("vendorToken");
      if (!token) {
        alert("Please login first!");
        return;
      }

      const form = new FormData();
      form.append("name", formData.name);
      form.append("brand", formData.brand);
      form.append("description", formData.description);
      form.append("category_id", formData.category_id);
      form.append("price", formData.price);
      form.append("discount", formData.discount);
      form.append("stockQuantity", formData.stockQuantity);
      form.append("req_prescription", formData.req_prescription);
      if (formData.imageFile) form.append("image", formData.imageFile);

      const res = await fetch("http://localhost:5000/api/medicines/add", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        setRecentlyAdded(data.medicine);

        setFormData({
          name: "",
          brand: "",
          description: "",
          category_id: "",
          price: "",
          discount: "",
          stockQuantity: "",
          req_prescription: false,
          imageFile: null,
          imagePreview: null,
        });
      } else alert("Error: " + data.message);
    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();

    // const files = e.dataTransfer?.files;
    const files = null;
    // ✅ TC14: files is null/undefined
    if (!files) {
      console.log("TC14: files is null or undefined");
      return;
    }

    // ✅ TC13: files exists but empty OR no valid file
    if (files.length === 0 || !files[0]) {
      console.log("TC13: Empty file list dropped");
      return;
    }

    // ✅ Valid file
    handleImageFile(files[0]);
  };
  const handleFileInputChange = (e) => {
    const files = e.target?.files;

    if (!files) {
      console.log("TC17: files is null");
      return;
    }

    if (files.length === 0 || !files[0]) {
      console.log("TC16: empty file list");
      return;
    }

    handleImageFile(files[0]);
  };
  const testEmptyDrop = () => {
    // Get the drop box element
    const imageDropBox = document.querySelector(".image-drop-box");
    
    // Create a fake drop event with empty DataTransfer
    const dropEvent = new DragEvent("drop", {
      dataTransfer: new DataTransfer() // empty FileList
    });

    // Dispatch the event
    imageDropBox.dispatchEvent(dropEvent);
  };


  return (
    <div className="add-page">
      <aside className="sidebar sleek-sidebar">
        <h2 className="sidebar-logo">Sehatly</h2>
        <ul>
          <li className="active-item">Dashboard</li>
          <li>My Medicines</li>
          <li>Settings</li>
        </ul>
      </aside>

      <div className="content-area">
        <header className="top-header">
          <h1>Add New Medicine</h1>
          <div className="user-icon">VP</div>
        </header>

        <div className="form-layout">
          <form className="form-card" onSubmit={handleSubmit}>
            <h2 className="section-head">General Information</h2>

            <div className="input-grid">
              <div>
                <label>Medicine Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div>
                <label>Brand</label>
                <input name="brand" value={formData.brand} onChange={handleChange} required />
              </div>
            </div>

            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />

            <div className="checkbox-wrapper">
              <label>
                <input
                  type="checkbox"
                  name="req_prescription"
                  checked={formData.req_prescription}
                  onChange={handleChange}
                />
                Requires Prescription
              </label>
            </div>

            {/* Right side image upload */}
            <div className="image-upload-panel">
              <h2>Upload Medicine Image</h2>
              <div
                className="image-drop-box"
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                // onDrop={(e) => {
                //   e.preventDefault();
                //   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                //     handleImageFile(e.dataTransfer.files[0]);
                //   }
                // }}
                onDrop ={handleDrop}
              >

                {formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    style={{ width: "150px", height: "150px", objectFit: "contain" }}
                  />
                ) : (
                  <p>Drag & Drop or Click to Upload</p>
                )}
          
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                />
              </div>
            </div>

            <h2 className="section-head">Pricing & Stock</h2>

            <div className="input-grid">
              <div>
                <label>Price (USD)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </div>

              <div>
                <label>Discount (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} />
              </div>

              <div>
                <label>Stock Quantity</label>
                <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required />
              </div>
            </div>

            <h2 className="section-head">Category</h2>
            <div className="dropdown-wrapper">
              <select name="category_id" value={formData.category_id} onChange={handleChange}>
                <option value="">Choose Category</option>
                {Object.entries(categories).map(([name, id]) => (
                  <option value={id} key={id}>{name}</option>
                ))}
              </select>
              <ChevronDown className="icon" />
            </div>

            <button className="submit-btn"><Plus /> Add Medicine</button>
          </form>

          {recentlyAdded && (
            <div className="preview-card">
              <h3>Recently Added</h3>
              <p><strong>{recentlyAdded.name}</strong></p>
              <p>{recentlyAdded.brand}</p>
              <p>USD {recentlyAdded.price}</p>
              <p style={{ color: recentlyAdded.req_prescription ? "red" : "green" }}>
                {recentlyAdded.req_prescription ? "Prescription Required" : "No Prescription"}
              </p>
              {recentlyAdded.image && (
                <img
                  src={`http://localhost:5000/images/medicines/${recentlyAdded.image}`}
                  alt={recentlyAdded.name}
                  style={{ width: "120px", height: "120px", objectFit: "contain", marginTop: "10px" }}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMedicine;
