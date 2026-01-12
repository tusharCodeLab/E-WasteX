import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import User from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('userId');

    if (targetUserId) {
      const targetUser = await User.findById(targetUserId).select('-password');
      if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      // Hide private details if not the owner
      const isOwner = user.userId === targetUserId;
      
      const profile = {
        _id: targetUser._id,
        name: targetUser.name,
        role: targetUser.role,
        bio: targetUser.bio,
        company: targetUser.company,
        location: targetUser.location,
        createdAt: targetUser.createdAt,
        // Conditional fields
        email: isOwner ? targetUser.email : 'Shared after interaction',
        phone: isOwner ? targetUser.phone : 'Shared after interaction',
        website: isOwner ? targetUser.website : 'Shared after interaction',
      };

      return NextResponse.json(profile);
    }

    // Get current user profile
    const currentUser = await User.findById(user.userId).select('-password');
    return NextResponse.json(currentUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, bio, company, location, phone, website } = body;

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { name, bio, company, location, phone, website },
      { new: true }
    ).select('-password');

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
