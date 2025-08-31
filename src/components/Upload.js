import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Document uploaded: " + response.data.id);
    } catch (error) {
      console.error("Error uploading document", error);
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload}>Upload</button>
    </div>
  );
};

export default Upload;
