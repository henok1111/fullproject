const UpdateAppointment = async (db, req, res) => {
    const { 'Appointment ID': appointmentId, time, date, note } = req.body;
  
    try {
      console.log(`Received request to update appointment ${appointmentId}`);
  
      // Execute the query to update appointment information in the database
      const result = await db.query("UPDATE appointment SET time = ?, date = ?, note = ? WHERE appointment_id = ?", [time, date, note, appointmentId]);
      
      console.log(`Appointment with ID ${appointmentId} updated successfully!`);
  
      // Log the SQL result
      console.log("SQL Result:", result);
  
      // Check if any rows were affected by the update
      if (result.affectedRows === 0) {
        // If no rows were affected, it means the appointment ID doesn't exist
        console.error(`No appointment found with ID ${appointmentId}`);
        res.status(404).json({ error: `No appointment found with ID ${appointmentId}` });
        return;
      }
  
      // Send success response
      res.json({ message: "Appointment updated successfully" });
    } catch (error) {
      // Handle errors
      console.error("Error updating appointment: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export default UpdateAppointment;
  