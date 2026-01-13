import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Listing from '@/models/Listing';
import Interest from '@/models/Interest';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();

    const [listingsCount, recyclersCount, totalMatches] = await Promise.all([
      Listing.countDocuments({ status: { $in: ['approved', 'sold'] } }),
      User.countDocuments({ role: 'buyer' }),
      Interest.countDocuments({ status: 'accepted' })
    ]);

    // Return real data. If 0, we'll handle it in the UI or show a realistic baseline if the user prefers, 
    // but the user said "real", so let's give real numbers.
    return NextResponse.json({
      listings: listingsCount,
      recyclers: recyclersCount,
      matches: totalMatches
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
