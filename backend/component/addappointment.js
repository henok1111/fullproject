import twilio from "twilio";

// Initialize Twilio client with your account SID and auth token
const twilioClient = twilio("accout_sid", "auth_token");

export const AddAppointment = async (db, req, res) => {
  try {
    console.log("AddAppointment API triggered");

    // Extract appointment data from the request body
    const {
      case_id,
      date,
      time,
      note,
      petitioner_phone_numbers,
      respondent_phone_numbers,
    } = req.body;

    // Validate required fields
    if (
      !case_id ||
      !date ||
      !time ||
      !note ||
      !petitioner_phone_numbers ||
      !respondent_phone_numbers
    ) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({
        error:
          "Missing required fields. Please provide all required information.",
      });
    }

    // Insert appointment data into the appointments table
    const [appointmentResults] = await db.query(
      "INSERT INTO appointment SET ?",
      {
        case_id,
        date,
        time,
        note,
      }
    );

    const appointmentId = appointmentResults.insertId;

    // Process petitioner phone numbers
    const petitionerPhoneNumbersArray = petitioner_phone_numbers.split(", ");
    await Promise.all(
      petitionerPhoneNumbersArray.map(async (phoneNumber) => {
        await db.query(
          "INSERT INTO appointment_phonenumber_map (appointment_id, phone_number) VALUES (?, ?)",
          [appointmentId, phoneNumber]
        );

        // Send SMS to petitioner using Twilio
        try {
          await twilioClient.messages.create({
            body: `Hello! You have a court appointment scheduled for ${date} at ${time} and  Note: ${note}.`,
            from: "twillio_number", // Your Twilio phone number
            to: phoneNumber,
          });
          console.log(`SMS sent successfully to petitioner ${phoneNumber}`);
        } catch (error) {
          console.error(
            `Error sending SMS to petitioner ${phoneNumber}:`,
            error
          );
        }
      })
    );

    // Process respondent phone numbers
    const respondentPhoneNumbersArray = respondent_phone_numbers.split(", ");
    await Promise.all(
      respondentPhoneNumbersArray.map(async (phoneNumber) => {
        await db.query(
          "INSERT INTO appointment_phonenumber_map (appointment_id, phone_number) VALUES (?, ?)",
          [appointmentId, phoneNumber]
        );

        // Send SMS to respondent using Twilio
        try {
          await twilioClient.messages.create({
            body: `Hello! You have a court appointment scheduled for ${date} at ${time} Note: ${note}.`,
            from: "+12512572537", // Your Twilio phone number
            to: phoneNumber,
          });
          console.log(`SMS sent successfully to respondent ${phoneNumber}`);
        } catch (error) {
          console.error(
            `Error sending SMS to respondent ${phoneNumber}:`,
            error
          );
        }
      })
    );

    res
      .status(201)
      .json({ message: "Appointment added successfully", appointmentId });
  } catch (error) {
    console.error("Error adding appointment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
