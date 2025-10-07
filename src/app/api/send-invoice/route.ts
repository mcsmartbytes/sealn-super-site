import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/utils/supabase';

export async function POST(request: NextRequest) {
  try {
    // Lazy initialize Resend to avoid build-time errors
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.'
      }, { status: 503 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { invoiceId, recipientEmail, recipientName } = await request.json();

    // Fetch invoice data
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select(`
        *,
        customers (name, email, phone, address),
        invoice_items (
          id,
          quantity,
          unit_price,
          total_price,
          notes,
          services (name, unit)
        )
      `)
      .eq('id', invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Calculate totals
    const items = invoice.invoice_items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.total_price || 0), 0);
    const tax = subtotal * 0.08; // 8% tax, adjust as needed
    const total = subtotal + tax;

    // Determine payment status styling
    const statusColor = invoice.status === 'paid' ? '#10b981' : invoice.status === 'pending' ? '#f59e0b' : '#ef4444';
    const statusText = invoice.status?.toUpperCase() || 'PENDING';

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
          .invoice-info { background: white; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; background: ${statusColor}; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #1a1a1a; color: #FFD700; }
          .total-row { font-weight: bold; font-size: 1.2em; background: #f0f0f0; }
          .payment-info { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
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
            <h2>Invoice #${invoice.invoice_number || invoice.id}</h2>

            <div class="invoice-info">
              <p><strong>Customer:</strong> ${invoice.customers?.name || recipientName}</p>
              <p><strong>Invoice Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'Upon Receipt'}</p>
              <p><strong>Status:</strong> <span class="status-badge">${statusText}</span></p>
            </div>

            ${invoice.description ? `<p><strong>Description:</strong><br>${invoice.description}</p>` : ''}

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
                  <td colspan="3" style="text-align: right;">Total Due:</td>
                  <td>$${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            ${invoice.status !== 'paid' ? `
              <div class="payment-info">
                <strong>Payment Instructions:</strong>
                <p>Please make payment within the specified due date. Payment can be made via:</p>
                <ul>
                  <li>Check payable to: Seal'n & Stripe'n Specialist</li>
                  <li>Online payment (if available)</li>
                  <li>Cash upon completion</li>
                </ul>
              </div>
            ` : `
              <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                <strong>✓ Payment Received</strong>
                <p>Thank you for your payment${invoice.paid_date ? ` on ${new Date(invoice.paid_date).toLocaleDateString()}` : ''}!</p>
              </div>
            `}

            <p>Thank you for your business!</p>
            <p>If you have any questions about this invoice, please contact us.</p>
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
      subject: `Invoice #${invoice.invoice_number || invoice.id} from Seal'n & Stripe'n Specialist`,
      html: emailHtml,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json({ error: 'Failed to send email', details: emailError }, { status: 500 });
    }

    // Log email in database
    await supabase.from('email_logs').insert({
      recipient: recipientEmail,
      subject: `Invoice #${invoice.invoice_number || invoice.id}`,
      content: `Invoice sent to ${recipientName}`,
      email_type: 'invoice',
      status: 'sent'
    });

    return NextResponse.json({ success: true, emailId: emailData?.id });
  } catch (error: any) {
    console.error('Error sending invoice:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
