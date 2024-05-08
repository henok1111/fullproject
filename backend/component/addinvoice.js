const AddInvoice = async (db, req, res) => {
  try {
    console.log("Data received from frontend:", req.body); // Log the data received from frontend

    // Extract data from request body with default values
    const {
      case_id = null,
      invoice_number = null,
      invoice_date = null,
      due_date = null,
      note = null,
      total_amount = null,
      paid_status = null, // Add status as a parameter
      items = [],
    } = req.body;

    // Check if required fields are undefined or null
    if (
      invoice_number === undefined ||
      invoice_date === undefined ||
      due_date === undefined ||
      invoice_number === null ||
      invoice_date === null ||
      due_date === null
    ) {
      return res.status(400).json({
        message: "Invoice number, invoice date, and due date are required",
      });
    }

    // Insert the invoice record
    const insertInvoiceQuery =
      "INSERT INTO invoices (case_id, invoice_number, invoice_date, due_date, note, total_amount, paid_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const invoiceValues = [
      case_id,
      invoice_number,
      invoice_date,
      due_date,
      note,
      total_amount,
      paid_status || "Unpaid",
    ];
    const [invoiceInsertResult] = await db.query(
      insertInvoiceQuery,
      invoiceValues
    );
    const invoiceId = invoiceInsertResult.insertId;

    // Insert the invoice items
    const insertItemQuery =
      "INSERT INTO invoice_items (invoice_id, service, description, amount,paid_status) VALUES (?, ?, ?, ?,?)";
    for (const item of items) {
      const itemValues = [
        invoiceId,
        item.service || null,
        item.description || null,
        item.amount || null,
        item.paid_status || "Unpaid",
      ];
      await db.query(insertItemQuery, itemValues);
    }

    // If the case_id is available and the status is 'Paid', update the is_paid status in the cases table
    if (case_id && paid_status) {
      const updateCaseQuery = "UPDATE cases SET is_paid = ? WHERE case_id = ?";
      const updateCaseValues = [paid_status, case_id];
      await db.query(updateCaseQuery, updateCaseValues);
    }

    res.status(201).json({ message: "Invoice created successfully" });
  } catch (error) {
    console.error("Error adding invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default AddInvoice;
