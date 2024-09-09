import crypto from 'crypto';
import sharp from 'sharp';


export const generateHashBlur = async (imageBuffer: Buffer): Promise<string> => {
	const blurredBuffer = await sharp(imageBuffer).resize(20, 20).blur(10).toBuffer();

	const hash = crypto.createHash('sha256').update(blurredBuffer).digest('hex');

	return hash
}