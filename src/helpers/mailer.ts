import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
	try {
		const hashedToken = await bcryptjs.hash(userId.toString(), 10);

		if (emailType === "VERIFY") {
			await User.findByIdAndUpdate(userId, {
				verifyToken: hashedToken,
				verifyTokenExpiry: Date.now() + 3600000,
			});
		} else if (emailType === "RESET") {
			await User.findByIdAndUpdate(userId, {
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: Date.now() + 3600000,
			});
		}

		const transport = nodemailer.createTransport({
			host: "sandbox.smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "0fab04f8c39111", // should be in .env
				pass: "213503001d22ad", // should be in .env
			},
		});

		const mailOptions = {
			from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>',
			to: email,
			subject:
				emailType === "VERIFY" ? "Verify your email" : "Reset your password",
			html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${
				emailType === "VERIFY" ? "Verify your email" : "Reset your password"
			} or copy and paste the link below in your browser.<br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`,
		};

		const mailResponse = await transport.sendMail(mailOptions);

		return mailResponse;
	} catch (error: any) {
		throw new Error(error.message);
	}
};
