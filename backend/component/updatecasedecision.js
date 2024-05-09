const CaseDecision = async (db, req, res) => {
  const { caseId, decisionText } = req.body;

  try {
    console.log(`Received request to update case decision for case ${caseId}`);

    // Assuming you have columns named `judge_decision` and `case_status` in your `cases` table
    const result = await db.query(
      "UPDATE cases SET judge_decision = ?, case_status = 'closed' WHERE case_id = ?",
      [decisionText, caseId]
    );

    console.log(
      `Decision and case status updated for case ${caseId} successfully!`
    );

    res.json({ message: "Decision and case status updated successfully" });
  } catch (error) {
    console.error("Error updating decision and case status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default CaseDecision;
