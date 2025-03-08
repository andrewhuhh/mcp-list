import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

type PendingMCP = {
  id: string;
  name: string;
  company: string;
  description: string;
  hosting_type: string;
  setup_type: string;
  pricing: string;
  categories: string[];
  github_url: string;
  logo_url: string | null;
  features: Array<{ title: string; description: string }>;
  setup_guide: {
    steps: string[];
    command: string | null;
    url: string | null;
  };
  submitted_at: string;
  reviewed: boolean;
};

export const Admin = () => {
  const [pendingMCPs, setPendingMCPs] = useState<PendingMCP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingMCPs();
  }, []);

  const fetchPendingMCPs = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_mcps')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setPendingMCPs(data || []);
    } catch (error) {
      console.error('Error fetching pending MCPs:', error);
      toast.error("Failed to load pending submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (mcp: PendingMCP) => {
    try {
      // Insert into mcps table
      const { data: mcpData, error: mcpError } = await supabase
        .from('mcps')
        .insert({
          name: mcp.name,
          company: mcp.company,
          description: mcp.description,
          hosting_type: mcp.hosting_type,
          status: 'community',
          setup_type: mcp.setup_type,
          pricing: mcp.pricing,
          categories: mcp.categories,
          github_url: mcp.github_url,
          logo_url: mcp.logo_url
        })
        .select()
        .single();

      if (mcpError) throw mcpError;

      // Insert features
      if (mcp.features?.length > 0) {
        const { error: featuresError } = await supabase
          .from('features')
          .insert(
            mcp.features.map(feature => ({
              mcp_id: mcpData.id,
              title: feature.title,
              description: feature.description
            }))
          );

        if (featuresError) throw featuresError;
      }

      // Insert setup guide
      if (mcp.setup_guide?.steps?.length > 0) {
        const { error: setupError } = await supabase
          .from('setup_guides')
          .insert({
            mcp_id: mcpData.id,
            steps: mcp.setup_guide.steps,
            command: mcp.setup_guide.command,
            url: mcp.setup_guide.url
          });

        if (setupError) throw setupError;
      }

      // Update pending_mcps status
      const { error: updateError } = await supabase
        .from('pending_mcps')
        .update({
          reviewed: true,
          reviewed_at: new Date().toISOString(),
          review_notes: 'Approved and published'
        })
        .eq('id', mcp.id);

      if (updateError) throw updateError;

      toast.success("MCP approved and published successfully");
      fetchPendingMCPs();
    } catch (error) {
      console.error('Error approving MCP:', error);
      toast.error("Failed to approve MCP");
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('pending_mcps')
        .update({
          reviewed: true,
          reviewed_at: new Date().toISOString(),
          review_notes: reason
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("MCP submission rejected");
      fetchPendingMCPs();
    } catch (error) {
      console.error('Error rejecting MCP:', error);
      toast.error("Failed to reject MCP");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Review MCP Submissions</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingMCPs.map((mcp) => (
              <TableRow key={mcp.id}>
                <TableCell className="font-medium">{mcp.name}</TableCell>
                <TableCell>{mcp.company}</TableCell>
                <TableCell>{new Date(mcp.submitted_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {mcp.reviewed ? (
                    <Badge variant="secondary">Reviewed</Badge>
                  ) : (
                    <Badge>Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!mcp.reviewed && (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(mcp)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(mcp.id, 'Rejected by admin')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 