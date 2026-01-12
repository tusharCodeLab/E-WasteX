import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Listing from '@/models/Listing';
import Interest from '@/models/Interest';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const userId = user.userId;
    const role = user.role;

    let activeCount = 0;
    let completedCount = 0;
    let messageCount = 0;
    let categoryStats: any[] = [];
    let activityData: any[] = [];

    const objectUserId = new mongoose.Types.ObjectId(userId);

    if (role === 'seller') {
      activeCount = await Listing.countDocuments({ seller: userId, status: 'approved' });
      completedCount = await Listing.countDocuments({ seller: userId, status: 'sold' });
      messageCount = await Interest.countDocuments({ seller: userId, status: 'pending' });
      
      categoryStats = await Listing.aggregate([
        { $match: { seller: objectUserId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { category: '$_id', count: 1, _id: 0 } }
      ]);
    } else {
      activeCount = await Interest.countDocuments({ buyer: userId, status: 'pending' });
      completedCount = await Interest.countDocuments({ buyer: userId, status: 'completed' });
      messageCount = await Interest.countDocuments({ buyer: userId, status: 'accepted' });

      categoryStats = await Interest.aggregate([
        { $match: { buyer: objectUserId } },
        { $lookup: { from: 'listings', localField: 'listing', foreignField: '_id', as: 'listingData' } },
        { $unwind: '$listingData' },
        { $group: { _id: '$listingData.category', count: { $sum: 1 } } },
        { $project: { category: '$_id', count: 1, _id: 0 } }
      ]);
    }

    // Default impact metrics (real calculation based on completed deals)
    const impactScore = Math.min(100, (completedCount * 15) + (activeCount * 5));
    const carbonSaved = (completedCount * 0.1).toFixed(1);
    const mineralsRecovered = (completedCount * 5.8).toFixed(1);
    const eWasteDiverted = (completedCount * 50);

    // Activity volume (Historical data based on createdAt)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });

    activityData = await Promise.all(last7Days.map(async (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      let dayActive = 0;
      let dayCompleted = 0;

      if (role === 'seller') {
        dayActive = await Listing.countDocuments({ 
          seller: userId, 
          createdAt: { $gte: date, $lt: nextDate } 
        });
        dayCompleted = await Listing.countDocuments({ 
          seller: userId, 
          status: 'sold',
          updatedAt: { $gte: date, $lt: nextDate } 
        });
      } else {
        dayActive = await Interest.countDocuments({ 
          buyer: userId, 
          createdAt: { $gte: date, $lt: nextDate } 
        });
        dayCompleted = await Interest.countDocuments({ 
          buyer: userId, 
          status: 'completed',
          createdAt: { $gte: date, $lt: nextDate } // Simplified for buyer
        });
      }

      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        active: dayActive,
        completed: dayCompleted
      };
    }));

    return NextResponse.json({
      stats: {
        activeCount,
        messageCount,
        completedCount,
        impactScore
      },
      impact: {
        eWasteDiverted,
        carbonSaved,
        mineralsRecovered
      },
      categoryStats,
      activityData
    });
  } catch (error: any) {
    console.error('Stats Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
