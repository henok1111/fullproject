export const AddAppointment = async (db, req, res) => {
    try {
      console.log('AddAppointment API triggered');
  
      console.log('Appointment Data:', {
        case_id: req.body.case_id,
        date: req.body.date,
        time: req.body.time,
        note: req.body.note,
        petitioner_phone_numbers: req.body.petitioner_phone_numbers,
        respondent_phone_numbers: req.body.respondent_phone_numbers,
      });
  
      const appointmentData = req.body;
  
      // Validate appointment data
      if (!appointmentData || typeof appointmentData !== 'object') {
        console.error('Invalid request body:', appointmentData);
        return res.status(400).json({ error: "Invalid request body. Please provide a valid JSON object." });
      }
  
      const { case_id, date, time, note, petitioner_phone_numbers, respondent_phone_numbers } = appointmentData;
  
      // Validate required fields
      if (!case_id || !date || !time || !note || !petitioner_phone_numbers || !respondent_phone_numbers) {
        console.error('Missing required fields:', appointmentData);
        return res.status(400).json({ error: "Missing required fields. Please provide all required information." });
      }
  
      // Insert appointment data into the appointments table
      const [appointmentResults] = await db.query('INSERT INTO appointment SET ?', {
        case_id,
        date,
        time,
        note,
      });
  
      const appointmentId = appointmentResults.insertId;
  
      // Process petitioner phone numbers
      const petitionerPhoneNumbersArray = petitioner_phone_numbers.split(", ");
      await Promise.all(petitionerPhoneNumbersArray.map(async phoneNumber => {
        await db.query('INSERT INTO appointment_phonenumber_map (appointment_id, phone_number) VALUES (?, ?)', [appointmentId, phoneNumber]);
      }));
  
      // Process respondent phone numbers
      const respondentPhoneNumbersArray = respondent_phone_numbers.split(", ");
      await Promise.all(respondentPhoneNumbersArray.map(async phoneNumber => {
        await db.query('INSERT INTO appointment_phonenumber_map (appointment_id, phone_number) VALUES (?, ?)', [appointmentId, phoneNumber]);
      }));
  
      res.status(201).json({ message: "Appointment added successfully", appointmentId });
  
    } catch (error) {
      console.error('Error adding appointment:', error);
  
      if (error.details) {
        console.error('Validation Errors:', error.details);
        return res.status(400).json({ error: "Validation Error", details: error.details });
      }
  
      console.error('Error Details:', error.message, error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  