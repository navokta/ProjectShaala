import { verifyAccessToken } from './jwt';
import { connectToDatabase } from '../mongodb';
import User from '../models/User';

export async function getCurrentUser(request) {
  try {
    const token = request.cookies.get('accessToken')?.value;
    if (!token) return null;

    const decoded = verifyAccessToken(token);
    if (!decoded) return null;

    await connectToDatabase();
    const user = await User.findById(decoded.userId).select('-password -refreshToken');
    return user;
  } catch {
    return null;
  }
}