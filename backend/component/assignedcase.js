const assignJudgeToCase = async (db, req, res) => {
    console.log("POST request received at /api/assignJudgeToCase");
  
    // Extracting data from request body
    const d = req.body;
  console.log(d);
  const assignedJudge = req.body.selectedJudge;
  const caseId = req.body.selectedCaseId;
    try {
      // Log the received case id and assigned judge
      console.log("Received Case ID:", caseId);
      console.log("Received Assigned Judge:", assignedJudge);
  
      // Update the cases table with the assigned judge
      const updateResult = await db.query("UPDATE cases SET assigned_judge = ? WHERE case_id = ?", [assignedJudge, caseId]);
      console.log("Result from updating cases table:", updateResult);
  
      res.json({ message: "Assigned judge to case successfully" });
    } catch (error) {
      console.error("Error assigning judge to case: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  export default assignJudgeToCase;
  