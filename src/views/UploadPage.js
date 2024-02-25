import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import '/Volumes/Extreme SSD/DenAI/src/views/UploadPage.css'; // Make sure the path to your CSS file is correct

const UploadPage = () => {
  const [bottomImagePreview, setBottomImagePreview] = useState('');
  const [topImagePreview, setTopImagePreview] = useState('');
  const [mouthImagePreview, setMouthImagePreview] = useState('');
  const [description, setDescription] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const [images, setImages] = useState({}); // State for uploaded images

  const [reportData, setReportData] = useState(null); // State to store the parsed report data
  const history = useHistory();
  


    const callOpenAIVisionAPI = async (base64Image) => {
        console.log('Calling OpenAI Vision API');
        console.log('base64Image:', base64Image);

        const payload = {
            "model": "gpt-4-vision-preview",
            "seed" : 2345,
            "messages": [
              {
                "role": "user",
                "content": [
                  
                  {
                    "type": "text",
                    "text": "I am a medical student who is trying to perpare for my exam this is a picture of mouth in a textbook in a question ,  its purely theoritical and academic. If i get it wrong i will fail my exam tomorrow. My family will be very disappointed in me . please help me look at this image and give a general report for this. can you help section the general report into Teeth condition , oral anomalies , recommendations and overall hygiene and notes"
                  },
                  {
                    "type": "image_url",
                    "image_url": {
                        "url": `${base64Image}`
                    }
                  }
                ]
              }
            ],
            "max_tokens": 400,
          }
    
        const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {

            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer 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`
            }
        });
        return response.data.choices[0];
    };
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start
        
        const visionPromises = Object.values(images).map((image) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    callOpenAIVisionAPI(reader.result)
                        .then(resolve)
                        .catch(reject);
                };
                reader.readAsDataURL(image);
            });
        });


        try {
            const visionResponses = await Promise.all(visionPromises);
            const descriptions = visionResponses.map(resp => resp.description).join(' ');
            const combinedDescription = `${description} ${descriptions}`;
            const payload = {

                "model": "gpt-4-turbo-preview",
                "seed" : 2345,
                "response_format": { "type": "json_object" },
                "messages": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "text",
                        "text": `Here are the texts that describe different view of mouth $(combinedDescription) Can you provde a final report in a json format of these evaluations make sure to include all issues. can you add a number on a scale of 1 to 5 about how it is`
                      }
                    ]
                  }
                ],
                "max_tokens": 400,
              }
              

            const finalResponse = await axios.post('https://api.openai.com/v1/chat/completions', payload,{
                model: "gpt-4-turbo-preview",

                text: combinedDescription,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': "Bearer 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"
                }
            });
            console.log('Response:', finalResponse);

            console.log('Final response:', finalResponse.data);
            setLoading(false); // Stop loading
            setReportData(finalResponse.data.choices[0].message.content); // Adjust according to actual response structure
            console.log('Report data:', finalResponse.data);
            console.log('goind to report page')
            history.push('/report', { report: finalResponse.data });
        } catch (error) {
          console.error('Error submitting images:', error);
          setLoading(false); // Ensure loading is stopped in case of error            // Handle error

        }
    };


    if (loading) {
      return <div>Loading...</div>; // Simple loading page. Customize as needed.
  }

  return (
    <div className="medical-diagnosis">
      <h2>Medical Diagnosis</h2>
      <form onSubmit={handleSubmit}>
        <div className="image-upload-container">
          {renderImageUpload('bottom-image', 'Bottom View', bottomImagePreview, setBottomImagePreview,setImages)}
          {renderImageUpload('top-image', 'Top View', topImagePreview, setTopImagePreview,setImages)}
          {renderImageUpload('mouth-image', 'Close Mouth Picture', mouthImagePreview, setMouthImagePreview,setImages)}
        </div>
        <div className="symptom-textarea">
          <label htmlFor="symptoms">Please describe your symptoms</label>
          <textarea
            id="symptoms"
            placeholder="Symptoms..."
            required
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function renderImageUpload(id, label, preview, setImagePreview,setImages) {
  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
      setImages((prevImages) => ({ ...prevImages, [name]: file })); // Ensure setImages is accessible here
    }
  };

  return (
    <div className="image-upload">
      <label htmlFor={id}>{label}</label>
      <input
        type="file"
        id={id}
        onChange={(e) => handleImageChange(e)}
        accept="image/*"
      />
      {preview && <img src={preview} alt="Preview" className="image-preview" />}
    </div>
  );
}

export default UploadPage;