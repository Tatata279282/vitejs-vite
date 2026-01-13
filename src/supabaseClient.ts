import { createClient } from '@supabase/supabase-js';

// Ваши данные из Supabase
const supabaseUrl = 'https://agwgfqsaozkegexynnov.supabase.co';
const supabaseKey = 'sb_publishable_qXY3dNawFjeJoHvfLl9cHQ_cjxNGK_3';

export const supabase = createClient(supabaseUrl, supabaseKey);