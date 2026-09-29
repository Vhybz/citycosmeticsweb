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

    const recipient = SITE_CONFIG.dispatchAlertPhone || '0503574865';
    const recipientIntl = SITE_CONFIG.dispatchAlertPhoneInternational || '233503574865';
    const formattedAmount = typeof total === 'number' ? total.toFixed(2) : total;

    // The user's exact required instruction for the SMS alert:
    // "go and check whatsapp for order details, confirm payment of the amount and give order to delivery for dispatch"
    const smsMessage = `CITY COSMETICS: New order #${orderNumber} placed by ${customerName}! Total: GH₵ ${formattedAmount}. Please check WhatsApp for order details, confirm payment of the amount and give order to delivery for dispatch.`;

    console.log(`[SMS DISPATCH ALERT] Triggered for Order #${orderNumber} to ${recipient}:`);
    console.log(`[SMS BODY] ${smsMessage}`);

    let providerUsed = 'simulated';
    let providerResponse: any = null;

    // 1. mNotify Ghana Integration (if MNOTIFY_API_KEY exists)
    if (process.env.MNOTIFY_API_KEY) {
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

    // 2. Arkesel Ghana Integration (if ARKESEL_API_KEY exists)
    else if (process.env.ARKESEL_API_KEY) {
      try {
        const res = await fetch('https://sms.arkesel.com/api/v2/sms/send', {
          method: 'POST',
          headers: {
            'api-key': process.env.ARKESEL_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: process.env.ARKESEL_SENDER_ID || 'CityCosmet',
            message: smsMessage,
            recipients: [recipientIntl],
          }),
        });
        providerResponse = await res.json();
        providerUsed = 'arkesel';
      } catch (aErr) {
        console.warn('Arkesel dispatch error:', aErr);
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
