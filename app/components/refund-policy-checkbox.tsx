'use client';

import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RefundPolicyCheckboxProps {
  onCheckedChange: (checked: boolean) => void;
}

export function RefundPolicyCheckbox({ onCheckedChange }: RefundPolicyCheckboxProps) {
  const [checked, setChecked] = useState(false);

  const handleCheckedChange = (checked: boolean) => {
    setChecked(checked);
    onCheckedChange(checked);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="refund-policy"
          checked={checked}
          onCheckedChange={handleCheckedChange}
        />
        <div className="grid gap-1.5 leading-none">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span>I agree to the</span>
            <Dialog>
              <DialogTrigger className="text-primary hover:underline cursor-pointer">
                Refund Policy
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Refund Policy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    Due to the digital nature of our products, all sales are final. Refunds will only be granted in the following cases:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Duplicate payments</li>
                    <li>Technical issues that prevent access to the service</li>
                    <li>Service unavailability exceeding 24 hours</li>
                  </ul>
                  <p>
                    Refund requests must be submitted within 7 days of purchase. To request a refund, please contact our support team with your order details.
                  </p>
                  <p>
                    Note: This policy does not override PayPals buyer protection policies. Users retain their rights under PayPals dispute resolution process.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}