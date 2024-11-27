import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// GraphQL Queries and Mutations
const GET_ALL_ROOMS = gql`
  query GetAllRooms {
    getAllRooms {
      id
      room_name
    }
  }
`;

const CREATE_ROOM = gql`
  mutation CreateRoom($room_name: String!) {
    createRoom(room_name: $room_name) {
      id
      room_name
    }
  }
`;

const DELETE_ROOM = gql`
  mutation DeleteRoom($id: ID!) {
    deleteRoom(id: $id) {
      id
    }
  }
`;

const RoomsList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_ROOMS);
  const [createRoom] = useMutation(CREATE_ROOM);
  const [deleteRoom] = useMutation(DELETE_ROOM);

  const [newRoomName, setNewRoomName] = useState("");

  // Handle Room Creation
  const handleAddRoom = async () => {
    if (!newRoomName.trim()) {
      alert("Room name cannot be empty!");
      return;
    }
    try {
      await createRoom({
        variables: { room_name: newRoomName },
      });
      setNewRoomName(""); // Clear input field
      refetch(); // Refresh the room list
    } catch (err) {
      console.error("Error creating room:", err);
    }
  };

  // Handle Room Deletion
  const handleDeleteRoom = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom({ variables: { id } });
        refetch(); // Refresh the room list
      } catch (err) {
        console.error("Error deleting room:", err);
      }
    }
  };

  if (loading) return <p>Loading rooms...</p>;
  if (error) return <p>Error loading rooms: {error.message}</p>;

  return (
    <div className="rooms-list">
      <h2>Rooms</h2>

      {/* Add Room Section */}
      <div className="add-room">
        <input
          type="text"
          placeholder="Enter room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
        />
        <button onClick={handleAddRoom}>Add Room</button>
      </div>

      {/* Room List */}
      <ul>
        {data.getAllRooms.map((room) => (
          <li key={room.id}>
            <Link to={`/devices/${room.id}`}>{room.room_name}</Link>
            <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsList;
