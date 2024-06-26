"use client";

import {Button} from '@/components/ui/button';
import { useState } from 'react';
import  axios  from 'axios';

interface SubscriptionButtonProps {
    isPro: boolean;
};

export const SubscriptionButton = ({
    isPro = false
}: SubscriptionButtonProps) => {

    const [loading, setLoading] = useState(false)

    const onClick  = async () => {
        try{
            setLoading(true);
            const response = await axios.get("/api/stripe");

            window.location.href = response.data.url;
        }catch (error){
            console.log("BILLING_ERROR", error)
        }finally{
            setLoading(false);
        }
    }

    return(
        <Button disabled={loading} variant = {isPro ? 'default' : 'default'} onClick={onClick}>
            {isPro ? 'Manage Subscription' : 'Upgrade'}
            {!isPro}
        </Button>
    )

}