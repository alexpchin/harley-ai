import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS for consistent styling

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [jsonResponse, setJsonResponse] = useState(null);
  const [question, setQuestion] = useState('');
  const [chatGPTResponse, setChatGPTResponse] = useState('');

  const handleImageChange = async (e) => {
    const inputFile = e.target.files[0];
    if (!inputFile) return;

    // Display the image
    setImage(URL.createObjectURL(inputFile));

    // Proceed to upload the image
    const formData = new FormData();
    formData.append('image_file', inputFile);

    try {
      const facePlusPlusResponse = await axios.post(
        'https://api-us.faceplusplus.com/facepp/v1/face/thousandlandmark',
        formData,
        {
          params: {
            api_key: 'YBuAQVEduxgyQK3Aqb9bgqFPGeUdVlay',
            api_secret: 'ROLyOtWY_ictK2lGNXD0RVwcDF0yxuP4',
            return_landmark: 'all',
          },
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Display the JSON response for debugging
      setJsonResponse(facePlusPlusResponse.data);

      // Optional: Send the JSON response to ChatGPT for a treatment plan
      if (question) {
        const treatmentResponse = await axios.post(
          'YOUR_CHATGPT_API_ENDPOINT',
          {
            data: facePlusPlusResponse.data,
            question: question,
          }
        );
        setTreatmentPlan(treatmentResponse.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleChatGPTQuestion = async () => {
    if (!jsonResponse) return; // Ensure there is a JSON response to send
    try {
      const response = await axios.post('YOUR_CHATGPT_API_ENDPOINT', {
        data: jsonResponse,
        question,
      });

      setChatGPTResponse(response.data);
    } catch (error) {
      console.error('Error getting response from ChatGPT:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {image && (
        <img
          src={image}
          alt="Uploaded"
          style={{ marginTop: '20px', maxWidth: '100%' }}
        />
      )}

      {jsonResponse && (
        <>
          <div className="json-response">
            <h3>JSON Response:</h3>
            <pre>{JSON.stringify(jsonResponse, null, 2)}</pre>
          </div>

          <input
            type="text"
            placeholder="Ask a question about the treatment plan..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={handleChatGPTQuestion}>Ask ChatGPT</button>

          {chatGPTResponse && (
            <div className="treatment-plan">
              <h3>ChatGPT Response:</h3>
              <p>{chatGPTResponse}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageUploader;
