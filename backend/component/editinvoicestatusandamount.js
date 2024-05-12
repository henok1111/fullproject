const EditSA = async (db, req, res) => {
  try {
    // Extract parameters from request body
    const { invoiceId, totalAmount, overallStatus, caseId, Note } = req.body;
    console.log("Data received from frontend:", req.body);

    // Update paid_status column in invoices table using parameterized query
    const updateInvoiceQuery = `
        UPDATE invoices
        SET paid_status = ?, total_amount = ?,note = ?
        WHERE invoice_id = ?;
      `;
    const invoiceValues = [overallStatus, totalAmount, Note, invoiceId];
    // Execute the query to update the invoice
    const [invoiceResult] = await db.query(updateInvoiceQuery, invoiceValues);
    console.log(invoiceResult);

    // Update isp_paid column in cases table based on caseId
    const updateCasesQuery = `
        UPDATE cases
        SET is_paid = ?
        WHERE case_id = ?;
      `;

    const caseValues = [overallStatus, caseId];
    const [caseResult] = await db.query(updateCasesQuery, caseValues);
    console.log(caseResult);

    const getCourtManagersQuery = `SELECT id FROM users WHERE role = "Court_Manager"`;
    const courtManagers = await db.query(getCourtManagersQuery);

    const notificationMessage = `The paid status for case ${caseId} has been unpdated to ${overallStatus}`;
    for (const courtmanager of courtManagers[0]) {
      const sqlInsert =
        "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
      db.query(
        sqlInsert,
        [courtmanager.id, notificationMessage],
        function (err, result) {
          if (err) {
            console.error("Error inserting notification:", err);
          }
        }
      );
    }

    if (invoiceResult.changedRows > 0 && caseResult.changedRows > 0) {
      res.status(200).json({
        success: true,
        message: "Invoice and case updated successfully",
      });
    } else {
      res.status(404).json({ success: false, error: "Item not found" });
    }
  } catch (error) {
    console.error("Error updating paid_status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default EditSA;
