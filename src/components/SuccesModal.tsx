import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function SuccessModal() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xs mx-auto bg-white rounded-2xl shadow-lg">
        <CardContent className="pt-6 pb-2 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-black rounded-2xl flex items-center justify-center">
            <Check className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-base">new task has been created</p>
            <p className="text-base">successfully</p>
          </div>
        </CardContent>
        <CardFooter className="pb-6 pt-2">
          <Button
            className="w-full bg-black hover:bg-black/90 text-white rounded-lg"
            size="lg">
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
