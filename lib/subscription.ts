import {auth} from '@clerk/nextjs'
import {db} from '@/lib/db';

const DAY_IN_MS = 86_400_000;

export const checkSubsciption = async () => {
    const {userId} = auth();

    if(!userId){
        return false;
    }

    const userSubscription = await db.subscription.findUnique({
        where:{
            userId: userId
        },
        select:{
            stripeSubscriptionId: true,
            stripeCurrentPeriodEnd: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });

    if(!userSubscription){
        return false;
    }   

    const isValid = 
    userSubscription.stripePriceId && 
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

    return !!isValid;
}