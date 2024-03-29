export const AddAppointment = async (db, req, res) => {
  const { case_id, date, time, note } = req.body; // Extract appointment data from the request body
  try {
      // Log the received values from the frontend
      console.log("Received values from frontend - caseId:", case_id, "date:", date, "time:", time, "note:", note);

      // Insert the appointment data into the database
      await db.query(
          "INSERT INTO appointment (case_id, date, time, note) VALUES (?, ?, ?, ?)",
          [case_id, date, time, note]
      );

      console.log("Appointment added successfully");
      res.status(200).json({ message: "Appointment added successfully" });
  } catch (error) {
      console.error("Error adding appointment:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};
