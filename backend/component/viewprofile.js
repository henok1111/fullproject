const viewProfile = (db, req, res) => {
  const adminData =
    "SELECT id, first_name, last_name, email, phone_number, address, role, status, image FROM users where id =?";
  db.query(adminData, (err, result) => {
    // console.log(result[0].password)
    res.send(result);
  });
};
export default viewProfile;
