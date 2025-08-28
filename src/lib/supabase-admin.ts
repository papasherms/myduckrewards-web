import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('Supabase admin client not configured. Service role key missing.');
}

// Admin client with service role key - bypasses RLS
// Use this ONLY for admin operations that need to bypass row-level security
export const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  : null;

// Admin functions that bypass RLS
export const adminFunctions = {
  // Get all users (admin only)
  async getAllUsers() {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get all businesses (admin only)
  async getAllBusinesses() {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Approve business application
  async approveBusiness(businessId: string, adminUserId: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { error } = await supabaseAdmin
      .from('businesses')
      .update({
        approval_status: 'approved',
        is_active: true,
        approved_at: new Date().toISOString(),
        approved_by: adminUserId
      })
      .eq('id', businessId);
    
    if (error) throw error;
  },

  // Reject business application
  async rejectBusiness(businessId: string, rejectionReason: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { error } = await supabaseAdmin
      .from('businesses')
      .update({
        approval_status: 'rejected',
        is_active: false,
        rejection_reason: rejectionReason
      })
      .eq('id', businessId);
    
    if (error) throw error;
  },

  // Suspend user account
  async suspendUser(userId: string, reason: string, adminUserId: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_suspended: true,
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
        suspended_by: adminUserId
      })
      .eq('id', userId);
    
    if (error) throw error;
  },

  // Unsuspend user account
  async unsuspendUser(userId: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_suspended: false,
        suspension_reason: null,
        suspended_at: null,
        suspended_by: null
      })
      .eq('id', userId);
    
    if (error) throw error;
  },

  // Delete user (hard delete - use with caution)
  async deleteUser(userId: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    // Delete from auth.users (this will cascade to public.users)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (error) throw error;
  },

  // Update user role
  async updateUserRole(userId: string, newRole: 'customer' | 'business' | 'admin') {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({ user_type: newRole })
      .eq('id', userId);
    
    if (error) throw error;
  },

  // Get system statistics
  async getSystemStats() {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const [
      { count: totalUsers },
      { count: totalBusinesses },
      { count: approvedBusinesses },
      { count: pendingBusinesses },
      { count: totalLocations },
      { count: totalDucks }
    ] = await Promise.all([
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('businesses').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('businesses').select('*', { count: 'exact', head: true }).eq('approval_status', 'approved'),
      supabaseAdmin.from('businesses').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending'),
      supabaseAdmin.from('locations').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('ducks').select('*', { count: 'exact', head: true })
    ]);
    
    return {
      totalUsers: totalUsers || 0,
      totalBusinesses: totalBusinesses || 0,
      approvedBusinesses: approvedBusinesses || 0,
      pendingBusinesses: pendingBusinesses || 0,
      totalLocations: totalLocations || 0,
      totalDucks: totalDucks || 0
    };
  },

  // Send email to user (requires email service setup)
  async sendEmailToUser(userId: string, subject: string, htmlContent: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    // Get user email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();
    
    if (userError || !user) throw userError || new Error('User not found');
    
    // This would integrate with your email service (SendGrid, Resend, etc.)
    // For now, we'll just log it
    console.log('Email would be sent to:', user.email, 'Subject:', subject);
    
    // TODO: Implement actual email sending
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'support@myduckrewards.com',
    //   to: user.email,
    //   subject: subject,
    //   html: htmlContent
    // });
  },

  // Bulk operations
  async bulkSuspendUsers(userIds: string[], reason: string, adminUserId: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        is_suspended: true,
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
        suspended_by: adminUserId
      })
      .in('id', userIds);
    
    if (error) throw error;
  }
};