import { Gestiono } from '@bitnation-dev/management/dist/package/src/server';
import { NextRequest, NextResponse } from 'next/server';
import { SAMPLE_PAYMENT } from './sample';

type Payment = typeof SAMPLE_PAYMENT;

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!req.body) return NextResponse.json({ status: 200 });
  const Payment = (await req.json()) as Payment;
  console.log(Payment);
  try {
    Gestiono.errorHandler = (e) => {
      return e.response.data;
    };
    const { pendingRecordId } = await Gestiono.postPendingRecord({
      elements: Payment.line_items.map((item) => {
        return {
          description: item.presentment_title,
          quantity: item.quantity,
          unit: 'UNIT',
          price: Number(item.line_price),
          variation: 0,
          resourceSku: item.sku
        };
      }),
      type: 'INVOICE',
      isSell: true,
      currency: Payment.currency as GestionoDataTypes.Currency,
      contact: {
        name: Payment.email || Payment.phone || '',
        type: 'CLIENT',
        contact: [
          {
            type: 'email' as const,
            data: Payment.email || ''
          },
          {
            type: 'whatsapp' as const,
            data: Payment.phone || ''
          }
        ].filter((contact) => contact.data)
      },
      divisionId: Number(process.env.GESTIONO_DIVISION_ID),
      isInstantDelivery: false,
      generateTaxId: 'none',
      updatePrices: false,
      createFirstInvoice: false
    });
    await Gestiono.payPendingRecord({
      pendingRecordId,
      paymentMethod: 'CASH',
      accountId: Number(process.env.GESTIONO_ACCOUNT_ID),
      reference: Payment.id.toString()
    });
  } catch (e) {
    console.error(e);
    // throw e
  }
  return NextResponse.json({ status: 200 });
}
