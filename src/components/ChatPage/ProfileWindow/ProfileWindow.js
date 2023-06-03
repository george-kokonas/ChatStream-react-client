import { useState, useRef } from "react";
import axios from "axios";

import API_URL from "../../helpers/config";
import getAuthHeaders from "../../helpers/authHeaders";

import styles from "./ProfileWindow.module.css";
import addProfilePic from "../../../assets/addProfileImage.png";
import "../../Loader/Loader.css";

const ProfileWindow = ({
  currentUser,
  onSetProfileWindow,
  onLoading,
  onExitRoom,
}) => {
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
      onLoading(true);
      await axios.post(
        `${API_URL}/profile/setImage/`,
        { userId: currentUser._id, profileImage: image },
        {
          headers: {
            ...getAuthHeaders().headers,
            "Content-Type": "application/json",
          },
        }
      );
      alert(
        "Profile Updated Successfully! Refresh the page to see the changes..."
      );
    } catch (error) {
      console.error(error);
      alert("Unable to upload Image...");
    }
    setImage("");
    onLoading(false);
  };

  const submitInfoHandler = async (event) => {
    event.preventDefault();
    if (!userInfo) return;

    try {
      onLoading(true);
      await axios.post(
        `${API_URL}/profile/setInfo/`,
        {
          userId: currentUser._id,
          userInfo,
        },
        getAuthHeaders()
      );
      alert(
        "Profile Updated Successfully! Refresh the page to see the changes..."
      );
    } catch (error) {
      alert("Unable to Update User Info...");
      console.log(error);
    }
    setUserInfo("");
    onLoading(false);
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
              onClick={() => {
                onSetProfileWindow();
                onExitRoom();
              }}
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
          <div className='d-flex justify-content-center'>
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
              placeholder='Enter something you want to share with the world (quote,mood)... '
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

export default ProfileWindow;