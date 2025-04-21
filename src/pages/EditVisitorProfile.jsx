import React, { useEffect, useState } from "react";
import { useUserStore } from "@/user_managment/user_store";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Card,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon, CameraIcon } from "@heroicons/react/24/solid";

export default function EditVisitorProfile() {
  const { id: Visitor_ID } = useUserStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Visitor_Name: "",
    Email: "",
    Phone_number: "",
    Address: "",
    password: "",
    profileImage: null,
  });

  const [initialData, setInitialData] = useState(null);
  const [previewImage, setPreviewImage] = useState("/img/placeholder-user-white-outline.png");
  const [editField, setEditField] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Check for field differences
  const isModified = initialData && Object.keys(formData).some((key) => {
    return key !== "profileImage" && formData[key] !== initialData[key];
  });

  // Email format check
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const fetchVisitorData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/visitor/getMemberByID`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Visitor_ID }),
      });

      const data = await response.json();

      if (response.ok && data.member) {
        const loaded = {
          Visitor_Name: data.member.Visitor_Name || "",
          Email: data.member.Email || "",
          Phone_number: data.member.Phone_number || "",
          Address: data.member.Address || "",
          password: data.member.password || "", // ✅ pull password directly
        };
        setFormData(loaded);
        setInitialData(loaded);
      }
       else {
        console.error("Failed to fetch visitor data:", data.error);
      }
    } catch (err) {
      console.error("Error loading visitor data:", err);
    }
  };

  useEffect(() => {
    if (Visitor_ID) fetchVisitorData();
  }, [Visitor_ID]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files?.[0]) {
      const imageUrl = URL.createObjectURL(files[0]);
      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate name (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(formData.Visitor_Name.trim())) {
      alert("Name can only contain letters, spaces, hyphens, and apostrophes.");
      return;
    }
  
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      alert("Please enter a valid email address.");
      return;
    }
  
    // ✅ Validate phone number in format 123-123-1231
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (formData.Phone_number && !phoneRegex.test(formData.Phone_number)) {
      alert("Phone number must be in the format 123-123-1231.");
      return;
    }
  
    // Validate password
    if (!formData.password || formData.password.length < 4) {
      alert("Password cannot be empty and must be at least 4 characters.");
      return;
    }
  
    try {
      const payload = { ...formData, Visitor_ID };
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/visitor/updateVisitorInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setEditField(null);
        setInitialData(formData); // Reset baseline
      } else {
        alert(result.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating profile");
    }
  };
  
  

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      {showToast && (
        <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-center animate-fade-in-out">
          Profile updated successfully!
        </div>
      )}

      <Card className="shadow-lg">
        <CardBody>
          <Typography variant="h5" className="mb-6 text-center">
            Visitor Profile
          </Typography>

          {/* Profile image upload */}
          <div className="flex justify-center mb-6 relative w-fit mx-auto">
            <img
              src={previewImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
            />
            
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries({
              Visitor_Name: "Name",
              Email: "Email",
              Phone_number: "Phone Number",
              Address: "Address",
              password: "Password",
            }).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                {editField === key ? (
                  <Input
                    label={label}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    type={key === "password" ? "password" : "text"}
                    className="flex-grow"
                  />
                ) : (
                  <div className="flex-grow">
                    <Typography variant="small" className="text-gray-600">
                      {label}
                    </Typography>
                    <Typography variant="paragraph">
                      {key === "password" ? "••••••••" : formData[key] || "Not set"}
                    </Typography>
                  </div>
                )}
                <IconButton
                  variant="text"
                  onClick={() => setEditField(editField === key ? null : key)}
                >
                  <PencilIcon className="h-4 w-4 text-blue-500" />
                </IconButton>
              </div>
            ))}

            <div className="flex justify-end mt-6">
              <Button type="submit" color="green" disabled={!isModified}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
