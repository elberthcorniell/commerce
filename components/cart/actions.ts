'use server';

import { TAGS } from 'lib/constants';
import { addToCart, createCart, getCart, removeFromCart, updateCart } from 'lib/shopify';
import { Cart } from 'lib/shopify/types';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  formData: {
    selectedVariantId: string | undefined;
    checkout?: boolean;
  }
) {
  let cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    cartId = cart.id;
    cookies().set('cartId', cartId);
  }

  if (!formData.selectedVariantId) {
    return 'Missing product variant ID';
  }

  try {
    await addToCart(cartId, [{ merchandiseId: formData.selectedVariantId, quantity: 1 }]);
    console.log(formData);
    if (!formData.checkout) revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
  if (formData.checkout) await checkout();
}

export async function removeItem(prevState: any, lineId: string) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    variantId: string;
    quantity: number;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);
      return;
    }

    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity
      }
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}

export async function checkout() {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }
  let cart: Cart | undefined;
  try {
    cart = await getCart(cartId);
    if (!cart) return 'Error creating checkout';
  } catch (e) {
    return 'Error creating checkout';
  }
  if (cart?.checkoutUrl) redirect(cart?.checkoutUrl);
}
