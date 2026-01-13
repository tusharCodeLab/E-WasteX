import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Interest from '@/models/Interest';
import Listing from '@/models/Listing';
import { getAuthUser } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'seller') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { status } = await req.json();

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const interest = await Interest.findOneAndUpdate(
      { _id: params.id, seller: user.userId },
      { status },
      { new: true }
    );

    if (!interest) {
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
    }

    if (status === 'completed') {
      await Listing.findByIdAndUpdate(interest.listing, { status: 'sold' });
    }

    return NextResponse.json(interest);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
