// Load Razorpay SDK
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(window.Razorpay);
    };
    document.body.appendChild(script);
  });
};

// Initialize Razorpay checkout
const initializeRazorpayCheckout = async ({
  keyId,
  subscriptionId,
  planName,
  onSuccess,
  onError
}) => {
  try {
    const Razorpay = await loadRazorpay();
    
    const options = {
      key: keyId,
      subscription_id: subscriptionId,
      name: 'AlphaBench',
      description: `${planName} Subscription`,
      handler: function(response) {
        if (onSuccess) onSuccess(response);
      },
      theme: {
        color: '#535bf2'
      },
      modal: {
        ondismiss: function() {
          if (onError) onError(new Error('Payment cancelled'));
        }
      }
    };

    const paymentObject = new Razorpay(options);
    paymentObject.open();
    
    return paymentObject;
  } catch (error) {
    if (onError) onError(error);
    throw error;
  }
}; 

export { initializeRazorpayCheckout, loadRazorpay };