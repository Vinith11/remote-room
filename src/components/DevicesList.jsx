import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_DEVICES_BY_ROOM_ID = gql`
  query GetDevicesByRoomId($room_id: ID!) {
    getDevicesByRoomId(room_id: $room_id) {
      id
      device_name
      state
    }
  }
`;

const DevicesList = () => {
  const { roomId } = useParams();
  const { loading, error, data } = useQuery(GET_DEVICES_BY_ROOM_ID, {
    variables: { room_id: roomId },
  });

  if (loading) return <p>Loading devices...</p>;
  if (error) return <p>Error loading devices: {error.message}</p>;

  return (
    <div className="devices-list">
      <h2>Devices</h2>
      <ul>
        {data.getDevicesByRoomId.map((device) => (
          <li key={device.id}>
            {device.device_name} - {device.state ? "ON" : "OFF"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevicesList;
