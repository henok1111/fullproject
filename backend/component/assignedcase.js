import socket from "./socket.js";

const assignJudgeToCase = async (db, req, res) => {
  console.log("POST request received at /api/assignJudgeToCase");

  // Extracting data from request body
  const assignedJudge = req.body.selectedJudgeId;
  const caseId = req.body.selectedCaseId;
  try {
    // Log the received case id and assigned judge
    console.log("Received Case ID:", caseId);
    console.log("Received Assigned Judge:", assignedJudge);

    // Update the cases table with the assigned judge
    const updateResult = await db.query(
      "UPDATE cases SET assigned_judge = ? WHERE case_id = ?",
      [assignedJudge, caseId]
    );

    res.json({ message: "Assigned judge to case successfully" });

    // Emit notification to the assigned judge's room
    socket.emit("send_notification", {
      Notification: "new case has been assigned",
      room: assignedJudge, // Emit notification to the assigned judge's room
    });
  } catch (error) {
    console.error("Error assigning judge to case: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default assignJudgeToCase;
