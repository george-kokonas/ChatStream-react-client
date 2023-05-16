import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';


const RegisteredUsers = ({
  registeredUser,
  isOnline,
  rooms,
  onNewConversation,
}) => {
  const selectedUserHandler = () => {
    //only allow chat with users that haven't started converstation yet(inluding yourself)
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].members.includes(registeredUser._id)) return;
    }
    //create a room with the selected user
    const selectedUserId = registeredUser._id;
    onNewConversation(selectedUserId);
  };

  return (
    <li className='p-2 border-bottom' style={{ backgroundColor: "#eee" }}>
      <a href='#!' className='d-flex justify-content-between'>
        <div className='d-flex flex-row'>
          <img
            src='https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp'
            alt='avatar'
            className='rounded-circle d-flex align-self-center me-3 shadow-1-strong'
            width='60'
          />
          <div onClick={selectedUserHandler} className='pt-1'>
            <p className='fw-bold mb-0'>{registeredUser.username}</p>
            <p className='small text-muted'>some user info maybe...</p>
          </div>
        </div>
        <div className='pt-1'>
          <p className='small text-muted mb-1'>
          <FontAwesomeIcon
        icon={faCircle}
        style={isOnline ? { color: 'green' } : { color: '#AA0000' }}
      />{' '}          </p>
          {/* <span className="badge bg-danger float-end">1</span> */}
        </div>
      </a>
    </li>
  );
};

export default RegisteredUsers;
