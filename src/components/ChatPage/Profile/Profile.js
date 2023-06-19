import { useState, useRef } from "react";
import axios from "axios";

import API_URL from "../../helpers/config";
import getAuthHeaders from "../../helpers/authHeaders";

import { MDBBtn } from "mdb-react-ui-kit";
import styles from "./Profile.module.scss";
import addProfilePic from "../../../assets/addProfileImage.png";
import "../../UI/Loader/Loader.css";

const Profile = ({ currentUser, setMainWindowContent, setIsLoading }) => {
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
      setIsLoading(true);
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
    setIsLoading(false);
  };

  const submitInfoHandler = async (event) => {
    event.preventDefault();
    if (!userInfo) return;

    try {
      setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <>
      {/* PROFILE WINDOW CONTAINER */}
      <div className={styles.profileContainer}>
        {/* USER UPLOAD PROFILE IMAGE CONTAINER */}
        <div className={styles.uploadImageContainer}>
          {/* close button */}
          <div className={styles.closeBtn}>
            <button
              type='button'
              className='btn-close btn-close-black '
              aria-label='Close'
              onClick={() => setMainWindowContent("")}
            />
          </div>

          {/* image preview */}
          <div
            className={`${styles.imagePreview} d-flex justify-content-center mb-4 `}
          >
            <img
              src={image ? image : `${addProfilePic}`}
              className={`${image} rounded-circle`}
              alt='add-profile'
              onClick={(event) => {
                event.preventDefault();
                imageInputRef.current.click();
              }}
              // width='40%'
            />
          </div>

          <div
            onClick={UploadImageHandler}
            className='d-flex justify-content-center'
          >
            <MDBBtn rounded className='mx-2 ' color='dark'>
              UPLOAD
            </MDBBtn>
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
          className={`${styles.userInfoContainer} d-flex justify-content-center`}
        >
          {/* text input */}
          <div className='form-group'>
            <input
              type='text'
              className={`${styles.userInfoInput} form-control`}
              aria-describedby='user-info-input'
              placeholder='Enter something you want to share with the world...'
              value={userInfo}
              onChange={(event) => setUserInfo(event.target.value)}
            />

            <div
              onClick={submitInfoHandler}
              className={`${styles.infoSubmitBtn} d-flex justify-content-center `}
            >
              <MDBBtn rounded className='my-2 ' color='dark'>
                SUBMIT
              </MDBBtn>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
