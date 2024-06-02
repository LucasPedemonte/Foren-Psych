import React, { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !file) {
      alert("Please provide both an email and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file);

    fetch("http://localhost:3000/upload", {
      // Update the URL to the backend
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert("File uploaded successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error uploading file");
      });
  };

  return (
    <div className="App">
      <h1>Upload File and Submit Email</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label>File:</label>
          <input type="file" onChange={handleFileChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
