import axios from "axios";

const GetUsers = () => {
  const token = localStorage.getItem("token");
  console.log(token);
  const getUsers = async () => {
    try {
      const data = await axios.get("http://localhost:8000/user/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        }});
        console.log(data);
      alert("list fetched!");
    } catch (error) {
      alert("INVALID DATA...");
      console.log(error);
    }
  };

  return (
    <>
      <button onClick={getUsers}>GetUsers</button>
    </>
  );
};

export default GetUsers;
