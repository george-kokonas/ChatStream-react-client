import "./About.css";

const About = () => {
  return (
    <>
      <h1 className='about-header'>Welcome to ChatStream!</h1>
      <p className='about-text'>
        <br />
        If you are a user, you can share the link with your friends{" "}
        <span role='img' aria-label='Smiling Face with Smiling Eyes'>
          😊
        </span>
        <br />
        (until traffic goes high and services start asking me for money{" "}
        <span role='img' aria-label='Intense Laughter'>
          😂
        </span>
        )
        <br />
        If you are a fellow developer, check my GitHub below!{" "}
        <span role='img' aria-label='Raised Hands'>
          🙌
        </span>
        <br />
        If you are a recruiter and you like it, email me, I'm actively looking
        for a job.{" "}
        <span role='img' aria-label='Envelope'>
          ✉️
        </span>
        <span role='img' aria-label='Smiling Face with Smiling Eyes'>
          😊
        </span>
        <br />
        <br />
        Feel free to connect,{" "}
        <span role='img' aria-label='Handshake'>
          🤝
        </span>
        <br />
        Thank you!{" "}
        <span role='img' aria-label='Folded Hands'>
          🙏
        </span>
      </p>
    </>
  );
};

export default About;
