import { CartItem, CustomerDetails, StoreContact, Product, ColorOption, ApparelSize } from '../types';

/**
 * Clean phone number to WhatsApp international format without leading + or 0
 * e.g., "0735418753" -> "254735418753"
 */
export function formatWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) {
    return '254' + digits.substring(1);
  }
  if (digits.startsWith('254')) {
    return digits;
  }
  return digits || '254735418753';
}

/**
 * Format currency in Kenyan Shillings
 */
export function formatKSh(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(amount).replace('KES', 'KSh');
}

/**
 * Generate a complete WhatsApp order message from Cart Items
 */
export function generateCartWhatsAppMessage(
  cartItems: CartItem[],
  customer: CustomerDetails,
  storeContact: StoreContact
): string {
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalEstimatedPrice = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

  const header = `👋 *NEW ORDER INQUIRY - ${storeContact.businessName.toUpperCase()}*\n`;
  const intro = `Hello! I would like to place an order for the following items:\n`;

  let itemsList = '';
  cartItems.forEach((item, index) => {
    const itemTotal = item.unitPrice * item.quantity;
    itemsList += `\n*${index + 1}. ${item.productName}*\n`;
    itemsList += `   • *Color:* ${item.selectedColor.name}\n`;
    itemsList += `   • *Size:* ${item.selectedSize}\n`;
    itemsList += `   • *Quantity:* ${item.quantity} pcs\n`;
    itemsList += `   • *Price:* ${formatKSh(item.unitPrice)} each (Subtotal: ${formatKSh(itemTotal)})\n`;
    
    if (item.customization && item.customization.enabled && item.customization.text.trim()) {
      const typeLabel = item.customization.type === 'embroidery' ? 'Embroidery' : 'Custom Print';
      itemsList += `   • *Custom Name/Text:* "${item.customization.text}" (${typeLabel}${item.customization.placement ? ` - ${item.customization.placement}` : ''})\n`;
    }
    
    if (item.notes && item.notes.trim()) {
      itemsList += `   • *Item Note:* ${item.notes.trim()}\n`;
    }
  });

  let summary = `\n━━━━━━━━━━━━━━━━━━━━\n`;
  summary += `📦 *Total Quantity:* ${totalItems} item${totalItems > 1 ? 's' : ''}\n`;
  summary += `💰 *Estimated Total:* ${formatKSh(totalEstimatedPrice)}\n`;
  summary += `━━━━━━━━━━━━━━━━━━━━\n`;

  let customerInfo = `\n👤 *Customer Details:*\n`;
  customerInfo += `• *Name:* ${customer.name.trim() || 'Not specified'}\n`;
  if (customer.phone.trim()) {
    customerInfo += `• *Phone:* ${customer.phone.trim()}\n`;
  }
  if (customer.location.trim()) {
    customerInfo += `• *Delivery Town / Area:* ${customer.location.trim()}\n`;
  }
  if (customer.notes.trim()) {
    customerInfo += `• *Additional Notes:* ${customer.notes.trim()}\n`;
  }

  const footer = `\n💬 *Payment & Delivery:* Please confirm availability and share payment instructions (M-Pesa / Bank) and delivery schedule. Thank you!`;

  return `${header}${intro}${itemsList}${summary}${customerInfo}${footer}`;
}

/**
 * Generate a single-item direct WhatsApp message
 */
export function generateSingleItemWhatsAppMessage(
  product: Product,
  selectedColor: ColorOption,
  selectedSize: ApparelSize,
  quantity: number,
  customText: string,
  customerName: string,
  customerLocation: string,
  storeContact: StoreContact
): string {
  const itemTotal = product.price * quantity;

  let msg = `👋 *ORDER INQUIRY - ${storeContact.businessName.toUpperCase()}*\n\n`;
  msg += `Hello! I would like to order:\n\n`;
  msg += `🧥 *Item:* ${product.name}\n`;
  msg += `🎨 *Color:* ${selectedColor.name}\n`;
  msg += `📏 *Size:* ${selectedSize}\n`;
  msg += `🔢 *Quantity:* ${quantity} pcs\n`;
  msg += `💰 *Estimated Price:* ${formatKSh(itemTotal)} (${formatKSh(product.price)} each)\n`;

  if (customText && customText.trim()) {
    msg += `✍️ *Custom Name/Text Print:* "${customText.trim()}"\n`;
  }

  if (customerName.trim() || customerLocation.trim()) {
    msg += `\n👤 *My Details:*\n`;
    if (customerName.trim()) msg += `• *Name:* ${customerName.trim()}\n`;
    if (customerLocation.trim()) msg += `• *Delivery Location:* ${customerLocation.trim()}\n`;
  }

  msg += `\n💬 Please confirm item availability and let me know the payment (M-Pesa) and delivery details. Thanks!`;

  return msg;
}

/**
 * Builds the URL to open WhatsApp
 */
export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = formatWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
