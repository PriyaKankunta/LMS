import { checkSubsciption } from "@/lib/subscription";
import { Settings } from "lucide-react";
import { SubscriptionButton } from "@/components/subscription-button";
import { Heading } from "@/components/ui/heading";

const SettingPage = async() => {
    
    const isPro = await checkSubsciption();
    return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="mt-[-200px]"> {/* Adjust the margin-top value as needed */}
            <Heading
              title="Settings"
              description="Manage account settings"
              icon={Settings}
              iconColor="text-gray-700"
              bgColor="bg-gray-700/10"
            />
      
            <div className="px-4 lg:px-8 space-y-4">
              <div className="text-muted-foreground text-sm">
                {isPro ? "You are currently on Pro Plan" : " You are not subscribed to a Pro Plan"}
              </div>
              <SubscriptionButton isPro={isPro} />
            </div>
          </div>
        </div>
      );
      
      
}

export default SettingPage