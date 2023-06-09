// In actions.ts
import { createAction } from '@reduxjs/toolkit';
import { UserRoles } from '@/types'; // Import the enum we created for user roles
import supabase  from '@/utils/supabaseClient'; // Import the Supabase client
import { createAsyncThunk } from "@reduxjs/toolkit";

export const navigateToInvestorDashboard = createAsyncThunk(
	'user/navigateToInvestorDashboard',
	async (userId: string, { rejectWithValue }) => {
		try {
		  const response = await fetch(`/api/fetchActiveRole?userId=${userId}`);
		  
		  if (!response.ok) {
			throw new Error('Network response was not ok');
		  }
	
		  const activeRole = await response.json();
	
		  // If the user's active role is 'investor', return a path to the investor dashboard
		  if (activeRole === UserRoles.Investor) {
			return '/i/dashboard';
		  }
	
		  // If the user's active role is not 'investor', return a default path
		  return '/';
		} catch (error: any) {
		  // If there was an error fetching the user's active role, return it as a rejected value
		  return rejectWithValue(error.message);
		}
	  }
	);

export const navigateToProducerDashboard = createAsyncThunk(
	'user/navigateToInvestorDashboard',
  // Fetch the user's active role from the database
  async (userId: string, { rejectWithValue }) => {
	try {
	  const response = await fetch(`/api/fetchActiveRole?userId=${userId}`);
	  
	  if (!response.ok) {
		throw new Error('Network response was not ok');
	  }

	  const activeRole = await response.json();

	  // If the user's active role is 'investor', return a path to the investor dashboard
	  if (activeRole === UserRoles.Producer) {
		return '/p/dashboard';
	  }

	  // If the user's active role is not 'investor', return a default path
	  return '/';
	} catch (error: any) {
	  // If there was an error fetching the user's active role, return it as a rejected value
	  return rejectWithValue(error.message);
	}
  }
);
