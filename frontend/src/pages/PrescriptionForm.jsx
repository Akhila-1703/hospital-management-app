import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";

function PrescriptionForm() {
  const { id } = useParams();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [submitting, setSubmitting] =
    useState(false);

  const [appointment, setAppointment] =
    useState(null);

  const [formData, setFormData] = useState({
    appointmentId: id,

    chiefComplaints: "",

    diagnosis: "",

    continueMedication: "",

    notes: "",

    medicines: [
      {
        name: "",

        dosage: "",

        timings: "",

        duration: "",

        instructions: "",
      },
    ],
  });

  const fetchAppointment = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/doctor-api/appointment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointment(res.data.payload);
    } catch (err) {
      console.log(err);

      alert("Failed to fetch appointment");
    }
  }, [id, token]);

  // Fetch appointment
  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  // Handle normal input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle medicine input
  const handleMedicineChange = (
    index,
    e
  ) => {
    const updatedMedicines = [
      ...formData.medicines,
    ];

    updatedMedicines[index][e.target.name] =
      e.target.value;

    setFormData({
      ...formData,
      medicines: updatedMedicines,
    });
  };

  // Add medicine
  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        {
          name: "",

          dosage: "",

          timings: "",

          duration: "",

          instructions: "",
        },
      ],
    });
  };

  // Remove medicine
  const removeMedicine = (index) => {
    if (formData.medicines.length === 1)
      return;

    const updatedMedicines =
      formData.medicines.filter(
        (_, i) => i !== index
      );

    setFormData({
      ...formData,
      medicines: updatedMedicines,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      // Check existing prescription
      try {
        const existing = await axios.get(
          `http://localhost:4000/prescription-api/appointment/${id}`
        );

        if (existing.data.payload) {
          alert(
            "Prescription already exists"
          );

          setSubmitting(false);

          return;
        }
      } catch {
        // Ignore 404
      }

      const payload = {
        ...formData,

        doctorId:
          appointment?.doctorId?._id,

        patientId:
          appointment?.patientId?._id,
      };

      const res = await axios.post(
        "http://localhost:4000/prescription-api",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      alert(
        "Prescription created successfully"
      );

      navigate("/doctor-dashboard");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Failed to create prescription"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (!appointment) {
    return (
      <div className="h-screen flex justify-center items-center text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Write Prescription
          </h1>

          <p className="text-gray-500 mt-2">
            Patient:{" "}
            {
              appointment?.patientId
                ?.userId?.name
            }
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Chief Complaints */}
          <div className="mb-8">

            <label className="block text-lg font-semibold mb-3">
              Chief Complaints
            </label>

            <textarea
              name="chiefComplaints"
              value={
                formData.chiefComplaints
              }
              onChange={handleChange}
              rows={3}
              required
              placeholder="Enter chief complaints..."
              className="w-full border border-gray-300 rounded-xl p-4"
            />

          </div>

          {/* Diagnosis */}
          <div className="mb-8">

            <label className="block text-lg font-semibold mb-3">
              Diagnosis
            </label>

            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Enter diagnosis..."
              className="w-full border border-gray-300 rounded-xl p-4"
            />

          </div>

          {/* Medicines */}
          <div className="mb-8">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-2xl font-semibold text-gray-800">
                Medicines
              </h2>

              <button
                type="button"
                onClick={addMedicine}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
              >
                Add Medicine
              </button>

            </div>

            {formData.medicines.map(
              (medicine, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border rounded-2xl p-5 mb-5"
                >

                  {/* Medicine Name */}
                  <div className="mb-5">

                    <label className="block font-medium mb-2">
                      Medicine Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(
                          index,
                          e
                        )
                      }
                      required
                      placeholder="Enter medicine name"
                      className="w-full border border-gray-300 rounded-xl p-3"
                    />

                  </div>

                  {/* Fields */}
                  <div className="grid md:grid-cols-2 gap-5">

                    {/* Dosage */}
                    <div>

                      <label className="block font-medium mb-2">
                        Dosage
                      </label>

                      <select
                        name="dosage"
                        value={medicine.dosage}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            e
                          )
                        }
                        required
                        className="w-full border border-gray-300 rounded-xl p-3"
                      >

                        <option value="">
                          Select Dosage
                        </option>

                        <option value="250mg">
                          250mg
                        </option>

                        <option value="500mg">
                          500mg
                        </option>

                        <option value="650mg">
                          650mg
                        </option>

                        <option value="1 Tablet">
                          1 Tablet
                        </option>

                        <option value="1/2 Tablet">
                          1/2 Tablet
                        </option>

                        <option value="2 Tablets">
                          2 Tablets
                        </option>

                        <option value="5 ml">
                          5 ml
                        </option>

                        <option value="10 ml">
                          10 ml
                        </option>

                        <option value="1 Capsule">
                          1 Capsule
                        </option>

                      </select>

                    </div>

                    {/* Timings */}
                    <div>

                      <label className="block font-medium mb-2">
                        Timings
                      </label>

                      <select
                        name="timings"
                        value={medicine.timings}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            e
                          )
                        }
                        required
                        className="w-full border border-gray-300 rounded-xl p-3"
                      >

                        <option value="">
                          Select Timings
                        </option>

                        <option value="Before Food">
                          Before Food
                        </option>

                        <option value="After Food">
                          After Food
                        </option>

                        <option value="Morning">
                          Morning
                        </option>

                        <option value="Afternoon">
                          Afternoon
                        </option>

                        <option value="Night">
                          Night
                        </option>

                        <option value="Morning & Night">
                          Morning & Night
                        </option>

                      </select>

                    </div>

                    {/* Duration */}
                    <div>

                      <label className="block font-medium mb-2">
                        Duration
                      </label>

                      <select
                        name="duration"
                        value={medicine.duration}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            e
                          )
                        }
                        required
                        className="w-full border border-gray-300 rounded-xl p-3"
                      >

                        <option value="">
                          Select Duration
                        </option>

                        <option value="3 Days">
                          3 Days
                        </option>

                        <option value="5 Days">
                          5 Days
                        </option>

                        <option value="7 Days">
                          7 Days
                        </option>

                        <option value="10 Days">
                          10 Days
                        </option>

                        <option value="15 Days">
                          15 Days
                        </option>

                      </select>

                    </div>

                    {/* Instructions */}
                    <div>

                      <label className="block font-medium mb-2">
                        Instructions
                      </label>

                      <input
                        type="text"
                        name="instructions"
                        value={
                          medicine.instructions
                        }
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            e
                          )
                        }
                        placeholder="Take after food"
                        className="w-full border border-gray-300 rounded-xl p-3"
                      />

                    </div>

                  </div>

                  {/* Remove Button */}
                  {formData.medicines.length >
                    1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeMedicine(index)
                      }
                      className="mt-5 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
                    >
                      Remove
                    </button>
                  )}

                </div>
              )
            )}

          </div>

          {/* Continue Medication */}
          <div className="mb-8">

            <label className="block text-lg font-semibold mb-3">
              Continue Medication
            </label>

            <input
              type="text"
              name="continueMedication"
              value={
                formData.continueMedication
              }
              onChange={handleChange}
              placeholder="Continue medication if needed"
              className="w-full border border-gray-300 rounded-xl p-4"
            />

          </div>

          {/* Notes */}
          <div className="mb-8">

            <label className="block text-lg font-semibold mb-3">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Additional instructions..."
              className="w-full border border-gray-300 rounded-xl p-4"
            />

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-semibold"
          >
            {submitting
              ? "Saving Prescription..."
              : "Save Prescription"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default PrescriptionForm;