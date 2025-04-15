import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { useLoaderData } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function ListPage() {
  const data = useLoaderData();
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
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          {data.map((item) => (
            <Card key={item.id} item={item} handleOpenChat={handleOpenChat} from="list" />

          ))}
        </div>
      </div>
      <div className="mapContainer">
        <Map items={data} />
      </div>
    </div>
  );
}

export default ListPage;
