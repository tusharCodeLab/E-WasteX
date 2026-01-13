import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const decoded = await getAuthUser(req);
    if (!decoded) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
