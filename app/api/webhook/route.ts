// This file handles webhook events from Stripe. It verifies the signature
// of each request to ensure that the request is coming from Stripe. It also
// handles the checkout.session.completed event type by creating a new purchase record in the database.
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";


const webhooksecret: string = process.env.STRIPE_WEBHOOK_SECRET!


export async function POST(req: Request) {

  const rawbody = await req.text();
  
  const signature = headers().get("stripe-signature")|| '' as string;
 
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      //body,
      rawbody,
      signature,
      webhooksecret)
  } catch (error: any) {
    

    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;
  const isSub = session?.metadata?.isSub == "subscribed" ? true : false;

  console.log('is sub', !userId || !courseId )
  if (event.type === "checkout.session.completed" ) {
   

    if(isSub){
      if (!userId || !isSub) {
        return new NextResponse(`Webhook Error: Missing metadata`, { status: 400 });
      }
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
  
      if (!session?.metadata?.userId) {
        return new NextResponse("User id is required", { status: 400 });
      }
  
      await db.subscription.create({
        data: {
          userId: session?.metadata?.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        },
      });
      console.log("Bought a subbbb")
    }
else if (courseId && userId){

    console.log("Bought a course")
    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: userId,
      }
    });
  } else {

    return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, { status: 200 })
  }
}


  return new NextResponse(null, { status: 200 });
}