import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useParams } from "react-router-dom";

// GraphQL Queries and Mutations
const GET_DEVICES_BY_ROOM_ID = gql`
  query GetDevicesByRoomId($room_id: ID!) {
    getDevicesByRoomId(room_id: $room_id) {
      id
      device_name
      state
    }
  }
`;

const CREATE_DEVICE = gql`
  mutation CreateDevice($device_name: String!, $state: Boolean!, $room_id: ID!) {
    createDevice(device_name: $device_name, state: $state, room_id: $room_id) {
      id
      device_name
      state
    }
  }
`;

const DELETE_DEVICE = gql`
  mutation DeleteDevice($id: ID!) {
    deleteDevice(id: $id) {
      id
    }
  }
`;

const TOGGLE_DEVICE_STATE = gql`
  mutation UpdateDeviceState($id: ID!, $state: Boolean!) {
    updateDeviceState(id: $id, state: $state) {
      id
      state
    }
  }
`;

const DevicesList = () => {
  const { roomId } = useParams();
  const { loading, error, data, refetch } = useQuery(GET_DEVICES_BY_ROOM_ID, {
    variables: { room_id: roomId },
  });

  const [createDevice] = useMutation(CREATE_DEVICE);
  const [deleteDevice] = useMutation(DELETE_DEVICE);
  const [toggleDeviceState] = useMutation(TOGGLE_DEVICE_STATE);

  const [newDeviceName, setNewDeviceName] = useState("");

  // Handle Add Device
  const handleAddDevice = async () => {
    if (!newDeviceName.trim()) {
      alert("Device name cannot be empty!");
      return;
    }
    try {
      await createDevice({
        variables: { device_name: newDeviceName, state: false, room_id: roomId },
      });
      setNewDeviceName(""); // Clear input field
      refetch(); // Refresh devices list
    } catch (err) {
      console.error("Error adding device:", err);
    }
  };

  // Handle Delete Device
  const handleDeleteDevice = async (id) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      try {
        await deleteDevice({ variables: { id } });
        refetch(); // Refresh devices list
      } catch (err) {
        console.error("Error deleting device:", err);
      }
    }
  };

  // Handle Toggle Device State
  const handleToggleState = async (id, currentState) => {
    try {
      await toggleDeviceState({ variables: { id, state: !currentState } });
      refetch(); // Refresh devices list
    } catch (err) {
      console.error("Error toggling device state:", err);
    }
  };

  if (loading) return <p>Loading devices...</p>;
  if (error) return <p>Error loading devices: {error.message}</p>;

  return (
    <div className="devices-list">
      <h2>Devices</h2>

      {/* Add Device Section */}
      <div className="add-device">
        <input
          type="text"
          placeholder="Enter device name"
          value={newDeviceName}
          onChange={(e) => setNewDeviceName(e.target.value)}
        />
        <button onClick={handleAddDevice}>Add Device</button>
      </div>

      {/* Devices List */}
      <ul>
        {data.getDevicesByRoomId.map((device) => (
          <li key={device.id}>
            {device.device_name} - {device.state ? "ON" : "OFF"}
            <button onClick={() => handleToggleState(device.id, device.state)}>
              Toggle
            </button>
            <button onClick={() => handleDeleteDevice(device.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevicesList;
