import React from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import { useNavigate } from "react-router-dom";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Fake hospital data
const hospitals = [
  {
    id: 1,
    name: "PeopleCare Hyderabad",
    city: "Hyderabad, Telangana",
    position: [17.385, 78.4867],
  },

  {
    id: 2,
    name: "PeopleCare Warangal",
    city: "Warangal, Telangana",
    position: [17.9689, 79.5941],
  },

  {
    id: 3,
    name: "PeopleCare Karimnagar",
    city: "Karimnagar, Telangana",
    position: [18.4386, 79.1288],
  },

  {
    id: 4,
    name: "PeopleCare Nizamabad",
    city: "Nizamabad, Telangana",
    position: [18.6725, 78.0941],
  },

  {
    id: 5,
    name: "PeopleCare Khammam",
    city: "Khammam, Telangana",
    position: [17.2473, 80.1514],
  },

  {
    id: 6,
    name: "PeopleCare Vijayawada",
    city: "Vijayawada, Andhra Pradesh",
    position: [16.5062, 80.648],
  },

  {
    id: 7,
    name: "PeopleCare Visakhapatnam",
    city: "Visakhapatnam, Andhra Pradesh",
    position: [17.6868, 83.2185],
  },

  {
    id: 8,
    name: "PeopleCare Guntur",
    city: "Guntur, Andhra Pradesh",
    position: [16.3067, 80.4365],
  },

  {
    id: 9,
    name: "PeopleCare Tirupati",
    city: "Tirupati, Andhra Pradesh",
    position: [13.6288, 79.4192],
  },

  {
    id: 10,
    name: "PeopleCare Kakinada",
    city: "Kakinada, Andhra Pradesh",
    position: [16.9891, 82.2475],
  },
];

function HospitalLocations() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between flex-wrap gap-4">

        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">
            PeopleCare Hospital Locations
          </h1>

          <p className="text-slate-500 mt-2">
            Explore our hospital branches across Telangana & Andhra Pradesh.
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="
            px-5
            py-2.5
            rounded-xl
            bg-red-500
            hover:bg-red-600
            text-white
            font-semibold
            transition
            shadow-md
          "
        >
          Close Map
        </button>

      </div>

      {/* Map */}
      <div
        className="
          w-full
          h-[700px]
          rounded-3xl
          overflow-hidden
          shadow-2xl
          border
          border-slate-200
        "
      >

        <MapContainer
          center={[17.385, 78.4867]}
          zoom={7}
          scrollWheelZoom={true}
          className="w-full h-full"
        >

          {/* OpenStreetMap */}
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Hospital Markers */}
          {hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={hospital.position}
            >

              <Popup>

                <div className="space-y-1 min-w-[180px]">

                  <h2 className="font-bold text-slate-800 text-base">
                    {hospital.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {hospital.city}
                  </p>

                </div>

              </Popup>

            </Marker>
          ))}

        </MapContainer>

      </div>

    </div>
  );
}

export default HospitalLocations;