import { useState, useRef } from "react";
import axios from "axios";
import styles from "./ProfileWindow.module.css";
import addProfilePic from "../../../assets/addProfileImage.jpg";

const ProfilePage = ({ user, onSetProfileWindow }) => {
  const [image, setImage] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const imageInputRef = useRef(null);

  const imageChangeHandler = (event) => {
    const selectedImage = event.target.files[0];
    if (!selectedImage) return;

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
        "http://localhost:8000/profile/setImage/",
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

  const submitInfoHandler = async (event) => {
    event.preventDefault();
    if (!userInfo) return;

    try {
      await axios.post("http://localhost:8000/profile/setInfo/", {userId: user._id, userInfo });
    } catch (error) {
      alert("Unable to Update User Info...")
      console.log(error);
    }
    setUserInfo("");
  };

  return (
    <>
      {/* PROFILE WINDOW CONTAINER */}
      <div className={styles.profileWindowContainer}>
        {/* USER UPLOAD PROFILE IMAGE CONTAINER */}
        <div className='upload-image-container'>
          {/* close button */}
          <div className={styles.closeBtnContainer}>
            <button
              type='button'
              className='btn-close btn-close-white '
              aria-label='Close'
              onClick={onSetProfileWindow}
            />
          </div>

          {/* image preview */}
          <div
            className={`${styles.imagePreview} d-flex justify-content-center mb-4 `}
          >
            <img
              src={image ? image : `${addProfilePic}`}
              className='rounded-circle'
              alt='add-profile'
              onClick={(event) => {
                event.preventDefault();
                imageInputRef.current.click();
              }}
              width='300'
              height='300'
            />
          </div>

          {/* upload button */}
          <div className={` d-flex justify-content-center`}>
            <div className={` ${styles.uploadBtn} btn btn-warning btn-rounded`}>
              <label
                className={`${styles.uploadBtn} form-label text-white m-1 `}
                htmlFor='upload-btn'
              >
                Upload
              </label>
              <input
                type='submit'
                className='form-control d-none'
                id='upload-btn'
                onClick={UploadImageHandler}
              />
            </div>
          </div>

          {/* input ref to open file explorer */}
          <input
            ref={imageInputRef}
            type='file'
            style={{ display: "none" }}
            onChange={imageChangeHandler}
          />
        </div>

        {/* UPLOAD USER INFO CONTAINER */}
        <div
          className={`${styles.userInfoContainer} d-flex justify-content-center mb-4 `}
        >
          {/* text input */}
          <div className='form-group'>
            <input
              type='text'
              className={`${styles.userInfoInput} form-control`}
              aria-describedby='user-info-input'
              placeholder='Enter quote or description up to 50 characters... '
              value={userInfo}
              onChange={(event) => setUserInfo(event.target.value)}
            />

            {/* submit button */}
            <div className={` d-flex justify-content-center mt-4`}>
              <div
                className={` ${styles.uploadBtn} btn btn-warning btn-rounded`}
              >
                <label
                  className={`${styles.uploadBtn} form-label text-white m-1 `}
                  htmlFor='submit-info-btn'
                >
                  SUBMIT
                </label>
                <input
                  type='submit'
                  className='form-control d-none'
                  id='submit-info-btn'
                  onClick={submitInfoHandler}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
