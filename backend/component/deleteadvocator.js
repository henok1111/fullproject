const deleteAdvocator = async (db, req, res) => {
    console.log("DELETE request received at /api/deleteAdvocator");
    const advocatorId = req.body.id; // Assuming the frontend sends advocator ID as 'id'
    console.log("Advocator ID to be deleted:", advocatorId);
  
    try {
      // Delete from advocators table using advocator_id instead of id
      const deleteAdvocatorResult = await db.query("DELETE FROM advocators WHERE advocator_id = ?", [advocatorId]);
      console.log("Result from deleting advocator:", deleteAdvocatorResult);
  
      res.json({ message: "Advocator deleted successfully" });
    } catch (error) {
      console.error("Error deleting advocator: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};

export default deleteAdvocator;
