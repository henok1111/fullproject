import bcrypt from "bcrypt";
const AddUser = async (db, req, res) => {
  const userData = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Do not store 'confirm_password' in the database

    // Update the query to use the hashed password
    const [results] = await db.query("INSERT INTO users SET ?", {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number,
      address: userData.address,
      password: hashedPassword,
      role: userData.role,
      status: "activated", // Assuming the default status is activated for a new user
    });

    res.json({
      message: "User created successfully",
      userId: results.insertId,
    });
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export default AddUser;
