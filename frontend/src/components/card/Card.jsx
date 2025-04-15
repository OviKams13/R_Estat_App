import { Link } from "react-router-dom";
import "./card.scss";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function Card({ item, handleOpenChat, from }) {
  const [saved, setSaved] = useState(item.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

    const handleSave = async (e) => {
      e.stopPropagation(); // éviter que le clic déclenche autre chose
      // if not logged in, redirect to login
      if (!currentUser) {
        navigate("/login");
        return;
      }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: item.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleChatClick = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    await handleOpenChat(item.userId);

    if (from !== "profile") {
      navigate("/profile"); // redirection seulement si on n'est pas déjà sur profile
    }
  };

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
      <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
          <div className="icon" onClick={handleSave}  style={{
                backgroundColor: saved ? "#2fd1ee" : "white",
              }}>
              <img src="/save.png" alt="" />
            </div>
            <div className="icon" onClick={handleChatClick}>
              <img src="/chat.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
