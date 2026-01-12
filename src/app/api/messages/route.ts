import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: Request) {
  await dbConnect();
  const session = await getAuthUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const listingId = searchParams.get('listingId');
  const userId = searchParams.get('userId'); 

  let query: any = {};

  if (session.role === 'admin') {
    if (listingId) query.listing = listingId;
    if (userId) query.$or = [{ sender: userId }, { receiver: userId }];
  } else {
    query.$or = [{ sender: session.userId }, { receiver: session.userId }];
    if (listingId) query.listing = listingId;
  }

  const messages = await Message.find(query)
    .populate('sender', 'name email role')
    .populate('receiver', 'name email role')
    .populate('listing', 'title')
    .sort({ createdAt: 1 });

  return NextResponse.json(messages);
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getAuthUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { receiverId, listingId, content } = body;

  const message = await Message.create({
    sender: session.userId,
    receiver: receiverId,
    listing: listingId,
    content,
  });

  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name email role')
    .populate('receiver', 'name email role')
    .populate('listing', 'title');

  return NextResponse.json(populatedMessage);
}
