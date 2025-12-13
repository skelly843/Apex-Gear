export type Service = {
  id?: number;
  name: string;
  description: string;
  duration_minutes: number;
  price_cents: number;
  deposit_cents?: number | null;
  active: boolean;
};

export type Zone = {
  id?: number;
  name: string;
  type: 'zip_list' | 'radius';
  zip_codes?: string[];
  center_lat?: number | null;
  center_lng?: number | null;
  radius_miles?: number | null;
  active: boolean;
};

export type Block = {
  id?: number;
  start_time: string;
  end_time: string;
  reason: string;
};
