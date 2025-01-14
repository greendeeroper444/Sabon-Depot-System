import React from 'react'
import IsDiscountValidUtils from "./IsDiscountValidUtils";


export default function CalculateFinalRefillPriceUtils(customer, product) {
    const shouldShowDiscount = IsDiscountValidUtils(customer) && product.discountPercentage > 0;
    const finalPrice = shouldShowDiscount ? product.discountedPrice.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : product.price.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    return {shouldShowDiscount, finalPrice};
}



export function calculateFinalRefillPriceModal(cartItem) {
    const refillPrice = cartItem.finalPrice 
    ? cartItem.finalPrice 
    : cartItem.productId.refillPrice;

    return refillPrice;
}

export function calculateFinalRefillPriceModalStaff(cartItem) {
    const refillPrice = cartItem.finalPrice 
    ? cartItem.finalPrice 
    : cartItem.productId.finalPrice;

    return refillPrice;
}


export function calculateSubtotalModalCustomer(cartItems) {
    const subtotal = cartItems.reduce((acc, cartItem) => {
        const refillPrice = calculateFinalRefillPriceModal(cartItem);
        return acc + (refillPrice * cartItem.quantity);
    }, 0);

    return subtotal.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

export function calculateSubtotalModal(cartItems) {
    const rawSubtotal = cartItems.reduce((acc, cartItem) => {
        const refillPrice = calculateFinalRefillPriceModal(cartItem);
        return acc + refillPrice * cartItem.quantity;
    }, 0);

    //initialize discount rate
    let discountRate = 0;

    //determine discount rate based on thresholds
    if(rawSubtotal >= 2000 && rawSubtotal < 10000){
        discountRate = 0.05; //5% discount
    } else if(rawSubtotal >= 10000){
        discountRate = 0.10; //10% discount
    }

    //calculate the discounted amount
    const discountAmount = rawSubtotal * discountRate;

    //calculate final subtotal after discount
    const finalSubtotal = rawSubtotal - discountAmount;

    return {
        rawSubtotal: rawSubtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
        finalSubtotal: finalSubtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
        discountRate: (discountRate * 100).toFixed(0),
        discountAmount: discountAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
    };
}

export function calculateSubtotalModalStaff(cartItems) {
    const rawSubtotal = cartItems.reduce((acc, cartItem) => {
        const refillPrice = calculateFinalRefillPriceModalStaff(cartItem);
        return acc + refillPrice * cartItem.quantity;
    }, 0);

    //initialize discount rate
    let discountRate = 0;

    //determine discount rate based on thresholds
    if(rawSubtotal >= 2000 && rawSubtotal < 10000){
        discountRate = 0.05; //5% discount
    } else if(rawSubtotal >= 10000){
        discountRate = 0.10; //10% discount
    }

    //calculate the discounted amount
    const discountAmount = rawSubtotal * discountRate;

    // Calculate final subtotal after discount
    const finalSubtotal = rawSubtotal - discountAmount;

    return {
        rawSubtotal: rawSubtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
        finalSubtotal: finalSubtotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
        discountRate: (discountRate * 100).toFixed(0),
        discountAmount: discountAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }),
    };
}