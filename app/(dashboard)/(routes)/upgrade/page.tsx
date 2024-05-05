'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useProModal } from '@/hooks/use-pro-modal';
import{Heading} from '@/components/ui/heading'
import { Zap } from "lucide-react";
const UpgradePage = () => {

        const proModel = useProModal();
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
        }, []);

        if(!mounted){
            return null;
        }

        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="mt-[-200px]"> {/* Adjust the margin-top value as needed */}
              <Heading
                title="Upgrade"
                description="Upgrade to Pro for $20/Month. Click the button to know more."
                icon={Zap}
                iconColor="text-gray-700"
                bgColor="bg-gray-700/10"
              />
          
              <div className="px-4 lg:px-8 space-y-4">
                <div className="px-3">
                  <Button onClick={proModel.onOpen}>Upgrade</Button>
                </div>
              </div>
            </div>
            </div>
          );
          
        }
export default UpgradePage;


                    