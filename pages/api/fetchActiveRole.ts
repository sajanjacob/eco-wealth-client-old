// pages/api/fetchActiveRole.ts
import  supabase  from '@/utils/supabaseClient'; // Import your Supabase client

export default async function fetchActiveRole(req: any, res: any) {
  const userId = req.query.userId;

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  if (!userId) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .select('active_role')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching active role:', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  res.status(200).json({ active_role: data?.active_role ?? null });
}
