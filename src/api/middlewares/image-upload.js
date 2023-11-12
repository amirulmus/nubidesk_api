import multer, { memoryStorage } from "multer";
import { errorHelper } from "../../utils/index.js";
import { awsAccessKey, awsSecretAccessKey, awsRegion, bucketName, env } from "../../config/index.js";
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
	region: awsRegion,
	credentials: {
		accessKeyId: awsAccessKey,
		secretAccessKey: awsSecretAccessKey,
	},
});

const storage = memoryStorage();

const fileFilter = (_req, file, cb) => {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/svg+xml") {
		cb(null, true);
	} else {
		cb(new Error("Invalid mime type"), false);
	}
};

const upload = multer({ storage: storage, limits: { fileSize: 1000000 }, fileFilter: fileFilter });

export async function singleUpload(req, res, next) {
	return upload.single("file")(req, res, () => {
		if (!req.file) return res.status(500).json(errorHelper("00000", req, "No File")).end();
		next();
	});
}

export async function multipleUpload(req, res, next) {
	return upload.array("files", 5)(req, res, () => {
		if (!req.files) return res.status(500).json(errorHelper("00000", req, "No File")).end();
		next();
	});
}

export async function uploadFile(file) {
	const params = {
		Bucket: bucketName,
		Key: `${env}/upload/nubitel-${Date.now()}-${file.originalname}`,
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	const command = new PutObjectCommand(params);
	const data = await s3.send(command);

	return {
		...data,
		url: `https://${bucketName}.s3.amazonaws.com/${params.Key}`,
		path: `/${params.Key}`,
	};
}

export async function uploadFileProgress(file) {
	const params = {
		Bucket: bucketName,
		Key: `${env}/upload/nubitel-${Date.now()}-${file.originalname}`,
		Body: file.buffer,
		ContentType: file.mimetype,
	};

	const upload = new Upload({
		client: s3,
		params,
	});

	upload.on("httpUploadProgress", (progress) => {
		console.log("progress", progress);
	});

	const data = await upload.done();

	return {
		...data,
		url: `https://${bucketName}.s3.amazonaws.com/${params.Key}`,
		path: `/${params.Key}`,
	};
}

export async function deleteFile(path) {
	const params = {
		Bucket: bucketName,
		Key: path,
	};

	const command = new DeleteObjectCommand(params);

	return await s3.send(command);
}

export async function listFile() {
	const params = {
		Bucket: bucketName,
	};

	const command = new ListObjectsCommand(params);

	return await s3.send(command);
}

export async function getFile(path, type = "private") {
	const params = {
		Bucket: bucketName,
		Key: path,
	};

	const command = new GetObjectCommand(params);
	if (type === "public") {
		return await s3.send(command);
	} else {
		return await getSignedUrl(s3, command, { expiresIn: 3600 });
	}
}
