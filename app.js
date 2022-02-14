require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.route");

const app = express();
const PORT = process.env.PORT || 5000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICESID;
const twilioClinet = require("twilio")(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/auth", authRoutes);
app.post("/", (req, res) => {
  const { message, user: sender, type, members } = req.body;

  if (type === "message.new") {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({ user }) => {
        if (!user.online) {
          twilioClinet.messages
            .create({
              body: `You a have a new message from ${message.user.fullName} - ${message.text}`,
              messagingServiceSid: messagingServiceSid,
              to: user.phoneNumber,
            })
            .then(() => {
              console.log("Message sent!");
            })
            .catch((err) => console.error(err));
        }
      });
    return res.status(200).json({ msg: "Message sent!" });
  }
  return res.status(200).json({ msg: "Not a new message request" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
