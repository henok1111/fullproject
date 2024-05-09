const updateDocumentStatus = async (db, req, res) => {
  const { docId, status } = req.body;
  console.log(docId, status);
  try {
    // Update the status of the document in the database
    await db.query("UPDATE prosecutor_documents SET status = ? WHERE id = ?", [
      status,
      docId,
    ]);

    res.json({ message: "Document status updated successfully" });
  } catch (error) {
    console.error("Error updating document status: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default updateDocumentStatus;
