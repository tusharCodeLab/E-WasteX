import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Interest from '@/models/Interest';
import Listing from '@/models/Listing';
import { getAuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'buyer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { listingId, message } = await req.json();

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if interest already exists
    const existing = await Interest.findOne({ 
      listing: listingId, 
      buyer: new mongoose.Types.ObjectId(user.userId) 
    });
    
    if (existing) {
      return NextResponse.json({ error: 'Interest already sent' }, { status: 400 });
    }

    const interest = await Interest.create({
      listing: new mongoose.Types.ObjectId(listingId),
      buyer: new mongoose.Types.ObjectId(user.userId),
      seller: new mongoose.Types.ObjectId(listing.seller),
      message,
      status: 'pending'
    });

    return NextResponse.json(interest, { status: 201 });
  } catch (error: any) {
    console.error('Interest POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    let query: any = {};
    if (user.role === 'buyer') {
      query.buyer = new mongoose.Types.ObjectId(user.userId);
    } else if (user.role === 'seller') {
      query.seller = new mongoose.Types.ObjectId(user.userId);
    }

    if (listingId) {
      query.listing = new mongoose.Types.ObjectId(listingId);
    }

    console.log('Interests fetch query:', JSON.stringify(query));
    
    const interests = await Interest.find(query)
      .populate('listing')
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(interests);
  } catch (error: any) {
    console.error('Interest GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
