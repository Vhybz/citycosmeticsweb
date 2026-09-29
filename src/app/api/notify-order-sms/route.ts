import { NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/lib/siteConfig';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderNumber = 'NEW',
      customerName = 'Customer',
      total = 0,
      phone = '',
      itemsCount = 1,
      channel = 'store',
    } = body;

    const rawRecipient = (process.env.ADMIN_PHONE || SITE_CONFIG.dispatchAlertPhone || '0503574865').trim();
    const cleanPhone = rawRecipient.replace(/[^0-9]/g, '');
    const recipientIntl = cleanPhone.startsWith('0') ? `233${cleanPhone.slice(1)}` : cleanPhone;
    const recipient = cleanPhone;
    const formattedAmount = typeof total === 'number' ? total.toFixed(2) : total;

    // The user's exact required instruction for the SMS alert:
    // "go and check whatsapp for order details, confirm payment of the amount and give order to delivery for dispatch"
    const smsMessage = `CITY COSMETICS: New order #${orderNumber} placed by ${customerName}! Total: GH₵ ${formattedAmount}. Please check WhatsApp for order details, confirm payment of the amount and give order to delivery for dispatch.`;

    console.log(`[SMS DISPATCH ALERT] Triggered for Order #${orderNumber} to ${recipient} (${recipientIntl}):`);
    console.log(`[SMS BODY] ${smsMessage}`);

    let providerUsed = 'simulated';
    let providerResponse: any = null;

    // 1. Arkesel Ghana Integration (Primary configured gateway)
    if (process.env.ARKESEL_API_KEY) {
      try {
        const configuredSender = (process.env.ARKESEL_SENDER_ID || '').trim() || 'CityCosmet';
        let res = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
          method: 'POST',
          headers: {
            'api-key': process.env.ARKESEL_API_KEY.trim(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: configuredSender,
            message: smsMessage,
            recipients: [recipientIntl],
          }),
        });
        providerResponse = await res.json();

        // If custom sender ID is not yet approved in Arkesel account, fallback to default 'Arkesel' sender
        if (providerResponse?.status === 'error' && configuredSender !== 'Arkesel') {
          console.warn(`Arkesel custom sender [${configuredSender}] returned error. Retrying with default 'Arkesel' sender...`);
          res = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
            method: 'POST',
            headers: {
              'api-key': process.env.ARKESEL_API_KEY.trim(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sender: 'Arkesel',
              message: smsMessage,
              recipients: [recipientIntl],
            }),
          });
          providerResponse = await res.json();
        }

        providerUsed = 'arkesel';
        console.log('[ARKESEL RESULT]', providerResponse);
      } catch (aErr) {
        console.warn('Arkesel dispatch error:', aErr);
      }
    }

    // 2. mNotify Ghana Integration (if MNOTIFY_API_KEY exists)
    else if (process.env.MNOTIFY_API_KEY) {
      try {
        const res = await fetch(`https://api.mnotify.com/api/sms/quick?key=${process.env.MNOTIFY_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient: [recipient],
            sender: process.env.MNOTIFY_SENDER_ID || 'CityCosmet',
            message: smsMessage,
          }),
        });
        providerResponse = await res.json();
        providerUsed = 'mnotify';
      } catch (mErr) {
        console.warn('mNotify dispatch error:', mErr);
      }
    }

    // 3. Hubtel Ghana Integration (if HUBTEL_CLIENT_ID & SECRET exist)
    else if (process.env.HUBTEL_CLIENT_ID && process.env.HUBTEL_CLIENT_SECRET) {
      try {
        const authHeader = Buffer.from(
          `${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`
        ).toString('base64');

        const res = await fetch('https://sms.hubtel.com/v1/messages/send', {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            From: process.env.HUBTEL_SENDER_ID || 'CityCosmetics',
            To: recipientIntl,
            Content: smsMessage,
          }),
        });
        providerResponse = await res.json();
        providerUsed = 'hubtel';
      } catch (hErr) {
        console.warn('Hubtel dispatch error:', hErr);
      }
    }

    // 4. Twilio Integration (if TWILIO credentials exist)
    else if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    ) {
      try {
        const auth = Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString('base64');

        const params = new URLSearchParams();
        params.append('From', process.env.TWILIO_PHONE_NUMBER);
        params.append('To', `+${recipientIntl}`);
        params.append('Body', smsMessage);

        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        );
        providerResponse = await res.json();
        providerUsed = 'twilio';
      } catch (tErr) {
        console.warn('Twilio dispatch error:', tErr);
      }
    }

    return NextResponse.json({
      success: true,
      recipient,
      recipientIntl,
      orderNumber,
      message: smsMessage,
      provider: providerUsed,
      providerResponse,
    });
  } catch (error: any) {
    console.error('Failed to process SMS notification:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
