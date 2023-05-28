import { useState, useRef } from "react";
import axios from "axios";

const ProfilePage = ({ user }) => {
  const [image, setImage] = useState("");
  const imageInputRef = useRef(null);

  const imageChangeHandler = (event) => {
    const selectedImage = event.target.files[0];
    if(!selectedImage) return;

    // Allowed image file types
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (!allowedTypes.includes(selectedImage.type)) {
      alert("Please select a valid image type (jpeg,png,gif");
      return;
    }

    // Encode image to base64
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const UploadImageHandler = async (event) => {
    event.preventDefault();
    if (!image) return;

    try {
      await axios.post(
        "http://localhost:8000/profile/uploadImage/",
        { userId: user._id, profileImage: image },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setImage("");
    } catch (error) {
      console.error(error);
      alert("Unable to upload Image...");
    }
  };

  return (
    <>
      <div className='d-flex justify-content-center mb-4'>
        <img
          src={
            image
              ? image
              : `https://mdbootstrap.com/img/Photos/Others/placeholder-avatar.jpg`
          }
          className='rounded-circle'
          alt='example placeholder'
          onClick={(event) => {
            event.preventDefault();
            imageInputRef.current.click();
          }}
          href='#'
          width='250'
          height='250'
        />
      </div>
      <div className='d-flex justify-content-center'>
        <div className='btn btn-primary btn-rounded'>
          <label className='form-label text-white m-1' htmlFor='upload-btn'>
            Upload
          </label>
          <input
            type='submit'
            className='form-control d-none'
            id='upload-btn'
            onClick={UploadImageHandler}
          />
        </div>
        <input
          ref={imageInputRef}
          type='file'
          style={{ display: "none" }}
          onChange={imageChangeHandler}
        />
      </div>
    </>
  );
};

export default ProfilePage;
