// import { supabase } from '../path/to/supabase';

// const fetchInvestmentData = async (producer_id_value) => {
//   try {
//     const { data, error } = await supabase
//       .from('producer_investment_view')
//       .select('*')
//       .eq('producer_id', producer_id_value);

//     if (error) {
//       console.error('Error fetching investment data:', error);
//       return;
//     }

//     console.log('Investment data:', data);
//     return data;
//   } catch (error) {
//     console.error('Error fetching investment data:', error);
//   }
// };
