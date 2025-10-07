import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/utils/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { estimateId, recipientEmail, recipientName } = await request.json();

    // Fetch estimate data
    const { data: estimate, error: estimateError } = await supabase
      .from('estimates')
      .select(`
        *,
        customers (name, email, phone, address),
        estimate_items (
          id,
          quantity,
          unit_price,
          total_price,
          notes,
          services (name, unit)
        )
      `)
      .eq('id', estimateId)
      .single();

    if (estimateError || !estimate) {
      return NextResponse.json({ error: 'Estimate not found' }, { status: 404 });
    }

    // Calculate totals
    const items = estimate.estimate_items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.total_price || 0), 0);
    const tax = subtotal * 0.08; // 8% tax, adjust as needed
    const total = subtotal + tax;

    // Create email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: #FFD700; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .estimate-info { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #1a1a1a; color: #FFD700; }
          .total-row { font-weight: bold; font-size: 1.2em; background: #f0f0f0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Seal'n & Stripe'n Specialist</h1>
            <p>Professional Sealcoating & Striping Services</p>
          </div>

          <div class="content">
            <h2>Estimate #${estimate.id}</h2>

            <div class="estimate-info">
              <p><strong>Customer:</strong> ${estimate.customers?.name || recipientName}</p>
              <p><strong>Date:</strong> ${new Date(estimate.created_at).toLocaleDateString()}</p>
              <p><strong>Valid Until:</strong> ${estimate.valid_until ? new Date(estimate.valid_until).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Status:</strong> ${estimate.status}</p>
            </div>

            ${estimate.description ? `<p><strong>Description:</strong><br>${estimate.description}</p>` : ''}

            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((item: any) => `
                  <tr>
                    <td>${item.services?.name || 'Service'}</td>
                    <td>${item.quantity} ${item.services?.unit || ''}</td>
                    <td>$${item.unit_price?.toFixed(2) || '0.00'}</td>
                    <td>$${item.total_price?.toFixed(2) || '0.00'}</td>
                  </tr>
                  ${item.notes ? `<tr><td colspan="4" style="font-size: 0.9em; color: #666;">Note: ${item.notes}</td></tr>` : ''}
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                  <td><strong>$${subtotal.toFixed(2)}</strong></td>
                </tr>
                <tr>
                  <td colspan="3" style="text-align: right;">Tax (8%):</td>
                  <td>$${tax.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;">Total:</td>
                  <td>$${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <p>Thank you for considering Seal'n & Stripe'n Specialist for your sealcoating and striping needs!</p>
            <p>If you have any questions about this estimate, please don't hesitate to contact us.</p>
          </div>

          <div class="footer">
            <p>Seal'n & Stripe'n Specialist</p>
            <p>Email: gary@sealnstripenspecialist.com | Website: www.sealnstripenspecialist.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Seal\'n & Stripe\'n Specialist <onboarding@resend.dev>', // Use your verified domain later
      to: recipientEmail,
      subject: `Estimate #${estimate.id} from Seal'n & Stripe'n Specialist`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json({ error: 'Failed to send email', details: emailError }, { status: 500 });
    }

    // Log email in database
    await supabase.from('email_logs').insert({
      recipient: recipientEmail,
      subject: `Estimate #${estimate.id}`,
      content: `Estimate sent to ${recipientName}`,
      email_type: 'estimate',
      status: 'sent'
    });

    return NextResponse.json({ success: true, emailId: emailData?.id });
  } catch (error: any) {
    console.error('Error sending estimate:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
