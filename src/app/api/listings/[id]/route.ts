import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Listing from '@/models/Listing';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const data = await req.json();
    const listing = await Listing.findById(params.id);

    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    if (user.role === 'admin') {
      if (data.status) listing.status = data.status;
    } 
    else if (user.role === 'seller' && listing.seller.toString() === user.userId) {
      if (data.title) listing.title = data.title;
      if (data.description) listing.description = data.description;
      if (data.condition) listing.condition = data.condition;
      if (data.location) listing.location = data.location;
      listing.status = 'pending';
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await listing.save();
    return NextResponse.json(listing);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const listing = await Listing.findById(params.id);
    if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 });

    if (user.role === 'admin' || (user.role === 'seller' && listing.seller.toString() === user.userId)) {
      await Listing.findByIdAndDelete(params.id);
      return NextResponse.json({ message: 'Deleted successfully' });
    }

    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
