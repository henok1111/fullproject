const viewProfile = (db, req, res) => {
  const adminData = "SELECT * from users where id =?;";
  db.query(adminData, (err, result) => {
    // console.log(result[0].password)
    res.send(result);
  });
};
export default viewProfile;
