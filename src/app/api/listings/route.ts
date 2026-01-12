import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Listing from '@/models/Listing';
import { getHazardLevel } from '@/lib/hazard';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    const hazardLevel = getHazardLevel(data.category);

    const listing = await Listing.create({
      ...data,
      hazardLevel,
      seller: user.userId,
      status: 'pending'
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const hazardLevel = searchParams.get('hazardLevel');
    const status = searchParams.get('status') || 'approved'; 
    const sellerId = searchParams.get('sellerId');

    const query: any = {};
    if (status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (hazardLevel && hazardLevel !== 'all') query.hazardLevel = hazardLevel;
    
    if (sellerId && sellerId !== 'undefined' && sellerId !== 'null') {
      try {
        query.seller = new mongoose.Types.ObjectId(sellerId);
      } catch (e) {
        console.error('Invalid sellerId:', sellerId);
      }
    }

    const listings = await Listing.find(query).populate('seller', 'name email').sort({ createdAt: -1 });

    const session = await getAuthUser(req);
    const sanitizedListings = listings.map(l => {
      const listing = l.toObject();
      if (session?.role !== 'admin' && session?.userId !== listing.seller._id.toString()) {
        // Remove exact address and slightly fuzz coordinates if necessary, 
        // or just rely on the frontend showing a large circle.
        // For strict privacy, we could return city-level coordinates.
        if (listing.preciseLocation) {
          delete listing.preciseLocation.address;
        }
      }
      return listing;
    });

    return NextResponse.json(sanitizedListings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
