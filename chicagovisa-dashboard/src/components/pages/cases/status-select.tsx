import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface FedexStatus {
  _id: string;
  title: string;
  color?: string;
}

interface StatusSelectComponentProps {
  form: UseFormReturn<any>;
  fieldName: string;
  label: string;
  trackingIdField: string;
  FedexStatuses: FedexStatus[];
}

const StatusSelectComponent: React.FC<StatusSelectComponentProps> = ({
  form,
  fieldName,
  label,
  trackingIdField,
  FedexStatuses
}) => {
  const trackingId = form.watch(trackingIdField);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="select status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
            {!trackingId &&
              <SelectItem value="not sent">Not Sent</SelectItem>}
              {trackingId && FedexStatuses
                ?.filter(status => status.title.toLowerCase() !== "not sent")
                .map((status) => (
                  <SelectItem
                    className={`capitalize ${status?.color}`}
                    key={status?._id}
                    value={status?.title.toLowerCase()}
                  >
                    {status?.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StatusSelectComponent;