import { createTransport } from "nodemailer";
import getText from "./lang/get-text.js";
import errorHelper from "./helpers/error-helper.js";

export default async (email, name, confirmCode, lang, type, req, res) => {
	new Promise(async (resolve, reject) => {
		if (!email || !confirmCode || (lang !== "tr" && lang !== "en")) {
			return res.status(400).send(errorHelper("00005", req)).end();
		}

		const emailTransfer = createTransport({
			host: "smtp.office365.com",
			port: 587,
			// secure: false, // use TLS
			tls: {
				ciphers: "SSLv3",
				rejectUnauthorized: false,
			},
			auth: {
				user: "dev@nubitel.co",
				// ...(process.env.NODE_ENV == "staging" && {
				pass: "23w1LLch4ngeth1snu81de$K",
				// }),
			},
		});

		let body = "";
		//NOTE: You can customize the message that will be sent to the newly registered users according to your pleasure.
		if (type == "register") {
			body = `${getText(lang, "welcomeCode")} ${name}!\r\n\r\n${getText(lang, "verificationCodeBody")} ${confirmCode}`;
		} else {
			body = `${getText(lang, "verificationCodeBody")} ${confirmCode}`;
		}

		const emailInfo = {
			from: "info@(APPNAME).com",
			to: email,
			subject: getText(lang, "verificationCodeTitle"),
			text: body,
		};

		try {
			await emailTransfer.sendMail(emailInfo);
			return resolve("Success");
		} catch (err) {
			return reject(err);
		}
	});
};
