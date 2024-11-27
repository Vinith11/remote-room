import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Link } from "react-router-dom";

const GET_ALL_ROOMS = gql`
  query GetAllRooms {
    getAllRooms {
      id
      room_name
    }
  }
`;

const RoomsList = () => {
  const { loading, error, data } = useQuery(GET_ALL_ROOMS);

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error loading rooms: {error.message}</p>;

  return (
    <div className="rooms-list">
      <h2>Rooms</h2>
      <ul>
        {data.getAllRooms.map((room) => (
          <li key={room.id}>
            <Link to={`/devices/${room.id}`}>{room.room_name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsList;
