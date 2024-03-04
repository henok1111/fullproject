const EditUser = async (db, req, res) => {
    const userData = req.body;
  
    try {
      await db.query("UPDATE users SET ? WHERE id = ?", [userData, userData.id]);
      res.json({ message: "User edited successfully" });
    } catch (error) {
      console.error("Error editing user: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export default EditUser;
  