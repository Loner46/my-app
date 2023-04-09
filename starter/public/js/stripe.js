/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
// const stripe = Stripe(`${process.env.STRIPE_PUBLISHABLE_KEY}`);
// const stripe = Stripe('pk_test_51L7JwqIrL4WZjVzDAndvLHqhiTIyFcdL41IMIkETp0lbOw9wMm7PEznzLsKwNPUBtb1zztvIfVpIDaqXgFBOVXko00LJHarUQZ');

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51L7JwqIrL4WZjVzDAndvLHqhiTIyFcdL41IMIkETp0lbOw9wMm7PEznzLsKwNPUBtb1zztvIfVpIDaqXgFBOVXko00LJHarUQZ'
    );
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }

  // 2) Create checkout form + charge credit card
};
