import exp from "express";
import puppeteer from "puppeteer";
import { PrescriptionModel } from "../models/PrescriptionModel.js";
import { AppointmentModel } from "../models/AppointmentModel.js";

export const prescriptionRoute = exp.Router();

prescriptionRoute.post("/", async (req, res) => {
  try {

    const prescription =
      await PrescriptionModel.create(req.body);

    // If an appointment ID is provided, automatically mark the appointment as COMPLETED
    if (req.body.appointmentId) {
      await AppointmentModel.findByIdAndUpdate(
        req.body.appointmentId,
        { status: "COMPLETED" }
      );
    }

    res.status(201).json({
      message: "Prescription created",
      payload: prescription,
    });

  } catch (error) {

    console.log(error);

    res.status(400).json({
      message: error.message,
    });

  }
});


prescriptionRoute.get("/", async (req, res) => {
  try {

    const prescriptions =
      await PrescriptionModel.find()
        .populate({
          path: "doctorId",
          populate: {
            path: "userId",
          },
        })
        .populate({
          path: "patientId",
          populate: {
            path: "userId",
          },
        })
        .populate("appointmentId");

    res.status(200).json({
      message: "Prescriptions fetched",
      payload: prescriptions,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
});


prescriptionRoute.get(
  "/appointment/:appointmentId",
  async (req, res) => {
    try {

      const prescription =
        await PrescriptionModel.findOne({
          appointmentId:
            req.params.appointmentId,
        })
          .populate({
            path: "doctorId",
            populate: {
              path: "userId",
            },
          })
          .populate({
            path: "patientId",
            populate: {
              path: "userId",
            },
          })
          .populate("appointmentId");

      if (!prescription) {
        return res.status(200).json({
          message: "Prescription not found",
          payload: null
        });
      }

      res.status(200).json({
        message: "Prescription fetched",
        payload: prescription,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });

    }
  }
);


prescriptionRoute.put("/:id", async (req, res) => {
  try {

    const prescription =
      await PrescriptionModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      message: "Prescription updated",
      payload: prescription,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
});


prescriptionRoute.delete("/:id", async (req, res) => {
  try {

    const prescription =
      await PrescriptionModel.findByIdAndDelete(
        req.params.id
      );

    if (!prescription) {
      return res.status(404).json({
        message: "Prescription not found",
      });
    }

    res.status(200).json({
      message: "Prescription deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
});


prescriptionRoute.get(
  "/:id/pdf",
  async (req, res) => {
    try {

      const prescription =
        await PrescriptionModel.findById(
          req.params.id
        )
          .populate({
            path: "doctorId",
            populate: {
              path: "userId",
            },
          })
          .populate({
            path: "patientId",
            populate: {
              path: "userId",
            },
          })
          .populate("appointmentId");

      if (!prescription) {
        return res.status(404).json({
          message: "Prescription not found",
        });
      }
      const html = `
<!DOCTYPE html>
<html>
<head>

<meta charset="UTF-8"/>

<style>

body{
  font-family: Arial, sans-serif;
  padding:20px;
  color:#1e293b;
  background:#f8fafc;
}

.container{
  width:100%;
  border:2px solid #2563eb;
  border-radius:18px;
  padding:25px;
  box-sizing:border-box;
}

.header{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  border-bottom:2px solid #2563eb;
  padding-bottom:15px;
  margin-bottom:20px;
}

.hospital-box h1{
  margin:0;
  color:#2563eb;
  font-size:34px;
}

.hospital-box p{
  margin:4px 0;
  color:#475569;
  font-size:14px;
}

.doctor-box{
  text-align:right;
}

.doctor-box h2{
  margin:0;
  font-size:24px;
  color:#0f172a;
}

.doctor-box p{
  margin:4px 0;
  color:#475569;
  font-size:14px;
}

.patient-section{
  display:flex;
  justify-content:space-between;
  background:#eff6ff;
  padding:15px;
  border-radius:12px;
  margin-bottom:20px;
}

.patient-section p{
  margin:6px 0;
  font-size:14px;
}

.section{
  margin-top:18px;
}

.section-title{
  background:#2563eb;
  color:white;
  padding:8px 14px;
  border-radius:8px;
  font-size:16px;
  margin-bottom:10px;
}

.notes{
  font-size:14px;
  line-height:1.6;
  padding:10px;
  background:#f8fafc;
  border-radius:10px;
}

table{
  width:100%;
  border-collapse:collapse;
  margin-top:10px;
}

th{
  background:#2563eb;
  color:white;
  padding:10px;
  border:1px solid #cbd5e1;
  font-size:13px;
}

td{
  padding:10px;
  border:1px solid #cbd5e1;
  font-size:13px;
}

.footer{
  margin-top:25px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.signature{
  text-align:right;
}

.signature h3{
  margin-bottom:5px;
}

.signature p{
  margin:0;
  color:#475569;
}

</style>

</head>

<body>

<div class="container">

  <div class="header">

    <div class="hospital-box">

      <h1>
        PeopleCare International Hospital
      </h1>

      <p>
        245 Health Avenue, Jubilee Hills,
        Hyderabad
      </p>

      <p>
        Phone: +91 9876543210
      </p>

      <p>
        Email: care@peoplecare.com
      </p>

    </div>

    <div class="doctor-box">

      <h2>
        Dr.
        ${
          prescription.doctorId?.userId
            ?.name || "Doctor"
        }
      </h2>

      <p>
        ${
          prescription.doctorId
            ?.specialization ||
          "General Physician"
        }
      </p>

      <p>
        Doctor ID:
        ${
          prescription.doctorId?._id
        }
      </p>

    </div>

  </div>

  <div class="patient-section">

    <div>

      <p>
        <strong>Patient:</strong>
        ${
          prescription.patientId?.userId
            ?.name || "Patient"
        }
      </p>

      <p>
        <strong>Patient ID:</strong>
        ${
          prescription.patientId?._id
        }
      </p>

    </div>

    <div>

      <p>
        <strong>Date:</strong>
        ${new Date().toLocaleDateString()}
      </p>

      <p>
        <strong>Time:</strong>
        ${
          prescription.appointmentId
            ?.time || "-"
        }
      </p>

    </div>

  </div>

  <div class="section">

    <div class="section-title">
      Chief Complaints
    </div>

    <div class="notes">
      ${
        prescription.chiefComplaints ||
        "-"
      }
    </div>

  </div>

  <div class="section">

    <div class="section-title">
      Diagnosis
    </div>

    <div class="notes">
      ${
        prescription.diagnosis || "-"
      }
    </div>

  </div>

  <div class="section">

    <div class="section-title">
      Prescription
    </div>

    <table>

      <tr>
        <th>S.No</th>
        <th>Medicine</th>
        <th>Dosage</th>
        <th>Timings</th>
        <th>Duration</th>
      </tr>

      ${prescription.medicines
        .map(
          (med, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${med.name}</td>
          <td>${med.dosage}</td>
          <td>${med.timings}</td>
          <td>${med.duration}</td>
        </tr>
      `
        )
        .join("")}

    </table>

  </div>

  <div class="section">

    <div class="section-title">
      Doctor Notes
    </div>

    <div class="notes">
      ${prescription.notes || "-"}
    </div>

  </div>

  <div class="footer">

    <div>
      <strong>
        Prescription ID:
      </strong>
      ${prescription._id}
    </div>

    <div class="signature">

      <h3>
        Dr.
        ${
          prescription.doctorId?.userId
            ?.name || "Doctor"
        }
      </h3>

      <p>
        Authorized Signature
      </p>

    </div>

  </div>

</div>

</body>
</html>
`;

      const browser =
        await puppeteer.launch({
          headless: true,
        });

      const page =
        await browser.newPage();

      await page.setContent(html, {
        waitUntil: "networkidle0",
      });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      await browser.close();

      res.set({
        "Content-Type":
          "application/pdf",

        "Content-Disposition":
          "attachment; filename=prescription.pdf",
      });

      res.send(pdf);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });

    }
  }
);