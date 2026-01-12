import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Listing from '@/models/Listing';
import Interest from '@/models/Interest';
import User from '@/models/User';
import Message from '@/models/Message';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Basic counts
    const [pendingCount, approvedCount, totalInterests, usersCount, messagesCount] = await Promise.all([
      Listing.countDocuments({ status: 'pending' }),
      Listing.countDocuments({ status: 'approved' }),
      Interest.countDocuments(),
      User.countDocuments(),
      Message.countDocuments()
    ]);

    // Aggregate data for charts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const registrationsByDay = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { 
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const listingsByDay = await Listing.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { 
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      pending: pendingCount,
      approved: approvedCount,
      total: pendingCount + approvedCount,
      impact: totalInterests,
      users: usersCount,
      messages: messagesCount,
      charts: {
        registrations: registrationsByDay,
        listings: listingsByDay
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
