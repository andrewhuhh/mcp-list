import { useState } from 'react';
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Flag } from 'lucide-react';
import { supabase } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const reportFormSchema = z.object({
  reason: z.enum([
    'inappropriate_content',
    'spam',
    'incorrect_information',
    'broken_implementation',
    'security_concern',
    'duplicate_entry',
    'other'
  ], {
    required_error: "Please select a reason for reporting.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not be longer than 500 characters.",
  }),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const REPORT_REASONS = {
  inappropriate_content: "Inappropriate Content",
  spam: "Spam",
  incorrect_information: "Incorrect Information",
  broken_implementation: "Broken Implementation",
  security_concern: "Security Concern",
  duplicate_entry: "Duplicate Entry",
  other: "Other"
} as const;

interface ReportDialogProps {
  mcpId: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function ReportDialog({ mcpId, size = 'md', className = '' }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    try {
      const { error } = await supabase.rpc('submit_mcp_report', {
        p_mcp_id: mcpId,
        p_reason: data.reason,
        p_description: data.description
      });

      if (error) throw error;

      toast.success("Report submitted", {
        description: "Thank you for your report. We will review it shortly.",
      });

      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to submit report. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-1.5 text-sm font-semibold rounded-full',
            'border py-0.5 px-2 transition-colors duration-200',
            'transition-all duration-200 hover:bg-secondary/50 hover:border-secondary/60 hover:scale-105',
            'text-gray-700 dark:text-gray-300',
            'bg-gray-100 dark:bg-gray-800',
            'border-gray-300 dark:border-gray-600',
            'hover:text-red-600 dark:hover:text-red-400',
            'hover:bg-red-100/50 dark:hover:bg-red-400/10',
            'hover:border-red-300 dark:hover:border-red-500',
            'hover:drop-shadow-md hover:drop-shadow-[0_4px_6px_rgba(239,68,68,0.5)]',
            className
          )}
        >
          <Flag className={cn(size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', 'fill-none stroke-current')} />
          <span>Report</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report MCP</DialogTitle>
          <DialogDescription>
            Submit a report if you find any issues with this MCP. Our team will review it shortly.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(REPORT_REASONS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about the issue..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Report</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 