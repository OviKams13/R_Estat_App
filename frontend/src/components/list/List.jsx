import "./list.scss";
import Card from "../card/Card";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function List({ posts }) {
  const { currentUser } = useContext(AuthContext);
  const [chat, setChat] = useState(null);

  const handleOpenChat = async (receiverId) => {
    try {
      const res = await apiRequest.post("/chats", { receiverId });
      setChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="list">
      {posts.map((item) => (
        <Card key={item.id} item={item} handleOpenChat={handleOpenChat} from="profile" />

      ))}

    </div>
  );
}

export default List;
