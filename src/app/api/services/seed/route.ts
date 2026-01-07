import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

// Services matching Area Bid Helper sealing-striping industry
const DEFAULT_SERVICES = [
  {
    name: 'Sealcoating',
    category: 'Sealcoating',
    base_price: 0.18,
    unit: 'sq_ft',
    description: 'Protective sealant application for asphalt surfaces',
    is_active: true,
  },
  {
    name: 'Crack Filling',
    category: 'Repair',
    base_price: 0.60,
    unit: 'linear_ft',
    description: 'Hot rubberized crack filler for asphalt cracks',
    is_active: true,
  },
  {
    name: 'Line Striping',
    category: 'Striping',
    base_price: 1.10,
    unit: 'linear_ft',
    description: 'Traffic paint line marking',
    is_active: true,
  },
  {
    name: 'Parking Stall Striping',
    category: 'Striping',
    base_price: 3.50,
    unit: 'stall',
    description: 'Individual parking space marking',
    is_active: true,
  },
  {
    name: 'ADA Handicap Markings',
    category: 'Striping',
    base_price: 85.00,
    unit: 'space',
    description: 'ADA compliant accessible parking symbols',
    is_active: true,
  },
  {
    name: 'Directional Arrows',
    category: 'Striping',
    base_price: 25.00,
    unit: 'each',
    description: 'Traffic flow directional arrows',
    is_active: true,
  },
  {
    name: 'Custom Stencils',
    category: 'Striping',
    base_price: 35.00,
    unit: 'each',
    description: 'STOP, YIELD, FIRE LANE, and other stencils',
    is_active: true,
  },
  {
    name: 'Curb Painting',
    category: 'Striping',
    base_price: 2.50,
    unit: 'linear_ft',
    description: 'Fire lane and no parking curb painting',
    is_active: true,
  },
  {
    name: 'Asphalt Patching',
    category: 'Repair',
    base_price: 5.00,
    unit: 'sq_ft',
    description: 'Patch and repair damaged asphalt areas',
    is_active: true,
  },
  {
    name: 'Power Washing',
    category: 'Cleaning',
    base_price: 0.10,
    unit: 'sq_ft',
    description: 'Pressure washing for surface preparation',
    is_active: true,
  },
];

export async function POST() {
  try {
    // Check if services already exist
    const { data: existingServices, error: checkError } = await supabase
      .from('services')
      .select('id')
      .limit(1);

    if (checkError) {
      return NextResponse.json(
        { success: false, error: checkError.message },
        { status: 500 }
      );
    }

    // If services exist, return early
    if (existingServices && existingServices.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Services already exist',
        seeded: false,
      });
    }

    // Insert default services
    const { data, error } = await supabase
      .from('services')
      .insert(DEFAULT_SERVICES)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${data.length} services`,
      seeded: true,
      services: data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to seed services' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      services: data,
      count: data?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
