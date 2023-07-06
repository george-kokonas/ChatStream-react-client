import { useState, useRef } from "react";
import axios from "axios";

import API_URL from "../../helpers/config";
import getAuthHeaders from "../../helpers/authHeaders";

import TextInput from "../../UI/TextInput/TextInput";
import Button from "../../UI/Button/Button";
import styles from "./Profile.module.scss";
import addProfilePic from "../../../assets/addProfileImage.png";
import "../../UI/Loader/Loader.css";

const Profile = ({ currentUser, setIsLoading }) => {
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
    }
    setUserInfo("");
    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      {/* UPLOAD USER IMAGE */}
      <div className={styles.uploadImageContainer}>
        <div
          className={`${styles.imagePreview} d-flex justify-content-center mb-4 `}
        >
          <img
            src={image ? image : `${addProfilePic}`}
            className={`${image} rounded-circle`}
            alt='add-profile'
            width="350"
            onClick={(event) => {
              event.preventDefault();
              imageInputRef.current.click();
            }}
          />
        </div>

        <div>
          <Button
            type='submit'
            text='upload'
            width='15vw'
            height='4.5vh'
            mobileWidth='40vw'
            mobileHeight='4.5vh'
            borderRadius='12px'
            backgroundColor='#ea8959e8'
            onClick={UploadImageHandler}
          />
        </div>

        {/* input ref to open file explorer */}
        <input
          ref={imageInputRef}
          type='file'
          style={{ display: "none" }}
          onChange={imageChangeHandler}
        />
      </div>
      <hr />

      {/* UPLOAD USER INFO */}
      <div className={styles.userInfoContainer}>
        <TextInput
          type='email'
          value={userInfo}
          placeholder='Enter something you want to share...'
          width='40vw'
          height='5.5vh'
          mobileWidth='70vw'
          mobileHeight='5.5vh'
          backgroundColor='#f5ede9e8'
          borderRadius='7px'
          onChange={(event) => setUserInfo(event.target.value)}
        />
        <div className={styles.submitInfoButton}>
          <Button
            type='submit'
            text='sumbit'
            width='15vw'
            height='4.5vh'
            mobileWidth='40vw'
            mobileHeight='4.5vh'
            borderRadius='12px'
            backgroundColor='#ea8959e8'
            onClick={submitInfoHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
